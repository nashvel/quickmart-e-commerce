<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\PlaceOrderRequest;
use App\Models\Order\Order;
use App\Models\Order\OrderItem;
use App\Models\Order\OrderItemAddon;
use App\Models\Cart\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display orders page
     */
    /**
     * Display orders page
     */
    public function index(Request $request)
    {
        // Load user's orders with items and products
        $orders = Order::with(['items.product', 'store'])
            ->where('customer_id', auth()->id())
            ->latest()
            ->get();

        // Format orders for frontend
        $formattedOrders = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'created_at' => $order->created_at->toISOString(),
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'store' => $order->store ? [
                    'id' => $order->store->id,
                    'name' => $order->store->name,
                    'logo' => $order->store->logo,
                ] : null,
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->product ? $item->product->name : 'Unknown Product',
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'image' => $item->product ? $item->product->image : null,
                    ];
                }),
            ];
        });

        return Inertia::render('Orders/Index', [
            'orders' => $formattedOrders,
        ]);
    }

    /**
     * Display order detail
     */
    public function show(Order $order)
    {
        // Ensure user owns this order
        if ($order->customer_id !== auth()->id()) {
            abort(403);
        }

        // Load order with items and products
        $order->load(['items.product', 'address']);

        // Calculate subtotal from items
        $subtotal = $order->items->sum(function ($item) {
            return $item->price * $item->quantity;
        });

        // Format the order data for the frontend
        $formattedOrder = [
            'id' => $order->id,
            'created_at' => $order->created_at->toISOString(),
            'total' => $order->total_amount,
            'subtotal' => $subtotal,
            'delivery_fee' => $order->delivery_fee ?? 50, // Default to 50 if not set
            'status' => $order->status,
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->product ? $item->product->name : 'Unknown Product',
                    'quantity' => $item->quantity,
                    'price' => $item->price * $item->quantity, // Total price for this item
                    'image' => $item->product ? $item->product->image : null,
                    'addOns' => [], // We'll implement add-ons later
                ];
            }),
        ];

        return Inertia::render('Orders/Show', [
            'order' => $formattedOrder,
        ]);
    }

    /**
     * Get orders via API
     */
    public function getOrders(Request $request)
    {
        $query = Order::with(['store', 'items.product'])
            ->where('customer_id', $request->user()->id)
            ->latest();

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $orders = $query->get();

        return response()->json(['data' => $orders]);
    }

    /**
     * Place a new order
     */
    public function store(PlaceOrderRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            // Get cart items
            $cartItems = CartItem::with(['product', 'variant', 'addons'])
                ->where('user_id', $request->user()->id)
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json(['message' => 'Cart is empty'], 400);
            }

            // Group by store
            $itemsByStore = $cartItems->groupBy('product.store_id');

            $orders = [];

            foreach ($itemsByStore as $storeId => $items) {
                // Calculate total
                $totalAmount = $items->sum('total_price');
                $deliveryFee = $items->first()->product->store->delivery_fee ?? 50;

                // Create order
                $order = Order::create([
                    'customer_id' => $request->user()->id,
                    'store_id' => $storeId,
                    'delivery_address_id' => $validated['delivery_address_id'],
                    'total_amount' => $totalAmount + $deliveryFee,
                    'delivery_fee' => $deliveryFee,
                    'status' => 'pending',
                    'payment_method' => $validated['payment_method'],
                    'notes' => $validated['notes'] ?? null,
                ]);

                // Create order items
                foreach ($items as $cartItem) {
                    $orderItem = OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $cartItem->product_id,
                        'variant_id' => $cartItem->variant_id,
                        'quantity' => $cartItem->quantity,
                        'price' => $cartItem->variant ? $cartItem->variant->price : $cartItem->product->price,
                    ]);

                    // Create order item addons
                    foreach ($cartItem->addons as $addon) {
                        OrderItemAddon::create([
                            'order_item_id' => $orderItem->id,
                            'addon_id' => $addon->addon_id,
                            'addon_variant_id' => $addon->addon_variant_id,
                            'quantity' => $addon->quantity,
                            'price' => $addon->price,
                        ]);
                    }
                }

                $orders[] = $order;
            }

            // Clear cart
            CartItem::where('user_id', $request->user()->id)->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'orders' => $orders,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to place order', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Cancel an order
     */
    public function cancel(Request $request, Order $order)
    {
        // Ensure user owns this order
        if ($order->customer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Can only cancel pending orders
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Cannot cancel this order'], 400);
        }

        $order->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Order cancelled']);
    }
}
