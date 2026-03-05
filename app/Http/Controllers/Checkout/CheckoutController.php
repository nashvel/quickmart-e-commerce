<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order\Order;
use App\Models\Order\OrderItem;
use App\Models\Address\Address;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Show checkout page
     */
    public function index(Request $request)
    {
        $addresses = $request->user()
            ->addresses()
            ->orderBy('is_default', 'desc')
            ->get()
            ->map(function ($address) {
                return [
                    'id' => $address->id,
                    'name' => $address->name,
                    'address_line' => $address->address_line_1, // For backward compatibility
                    'address_line_1' => $address->address_line_1,
                    'address_line_2' => $address->address_line_2,
                    'city' => $address->city,
                    'province' => $address->province,
                    'postal_code' => $address->postal_code,
                    'type' => $address->type,
                    'latitude' => $address->latitude,
                    'longitude' => $address->longitude,
                    'is_default' => $address->is_default,
                ];
            });
        
        return Inertia::render('Checkout/Index', [
            'addresses' => $addresses,
        ]);
    }
    
    /**
     * Process checkout and create order
     */
    public function processCheckout(Request $request)
    {
        try {
            // Log the incoming request for debugging
            Log::info('Checkout request received', [
                'user_id' => $request->user()->id,
                'cart_items_count' => count($request->input('cart_items', [])),
                'cart_items' => $request->input('cart_items'),
                'subtotal' => $request->input('subtotal'),
                'address_id' => $request->input('address_id'),
                'shipping_option' => $request->input('shipping_option'),
                'payment_method' => $request->input('payment_method'),
            ]);
            
            // Validate the request
            $validated = $request->validate([
                'address_id' => 'required|exists:addresses,id',
                'shipping_option' => 'required|in:door_to_door,pickup',
                'payment_method' => 'required|in:cod,online',
                'cart_items' => 'required|array|min:1', // Cart items are required
                'cart_items.*.product_id' => 'required|integer',
                'cart_items.*.variant_id' => 'nullable|integer',
                'cart_items.*.name' => 'required|string',
                'cart_items.*.price' => 'required', // Accept any type, we'll validate it's numeric later
                'cart_items.*.quantity' => 'required|integer|min:1',
                'cart_items.*.image' => 'nullable|string',
                'subtotal' => 'required|numeric|min:0',
            ]);
            
            // Additional validation for price fields
            foreach ($validated['cart_items'] as $index => $item) {
                if (!is_numeric($item['price']) || (float)$item['price'] < 0) {
                    throw new \Illuminate\Validation\ValidationException(
                        validator([], []),
                        ["cart_items.{$index}.price" => ["The price must be a valid positive number."]]
                    );
                }
            }

            $user = $request->user();
            
            // Verify the address belongs to the user
            $address = Address::where('id', $validated['address_id'])
                ->where('user_id', $user->id)
                ->first();
                
            if (!$address) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid address selected.'
                ], 400);
            }

            DB::beginTransaction();
            
            try {
                // Calculate totals
                $subtotal = $validated['subtotal'];
                $shippingFee = $validated['shipping_option'] === 'door_to_door' ? 50.00 : 0.00;
                $total = $subtotal + $shippingFee;
                
                // Create the order
                $order = Order::create([
                    'customer_id' => $user->id,
                    'store_id' => 1, // Default store for now
                    'delivery_address_id' => $validated['address_id'],
                    'total_amount' => $total,
                    'delivery_fee' => $shippingFee,
                    'payment_method' => $validated['payment_method'],
                    'status' => 'pending',
                    'notes' => 'Order placed via checkout',
                ]);

                // Create order items from cart data
                foreach ($validated['cart_items'] as $cartItem) {
                    Log::info('Creating order item', [
                        'product_id' => $cartItem['product_id'],
                        'name' => $cartItem['name'],
                        'price' => $cartItem['price'],
                        'quantity' => $cartItem['quantity'],
                    ]);
                    
                    $orderItem = OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $cartItem['product_id'],
                        'variant_id' => $cartItem['variant_id'] ?? null,
                        'quantity' => $cartItem['quantity'],
                        'price' => (float) $cartItem['price'], // Convert to float
                    ]);
                }
                
                Log::info('Order created successfully', [
                    'order_id' => $order->id,
                    'total_amount' => $order->total_amount,
                    'items_count' => $order->items()->count(),
                ]);
                
                DB::commit();
                
                return response()->json([
                    'success' => true,
                    'message' => 'Order placed successfully!',
                    'order_id' => $order->id,
                    'redirect_url' => '/orders/' . $order->id
                ]);
                
            } catch (\Exception $e) {
                DB::rollback();
                Log::error('Order creation failed: ' . $e->getMessage());
                
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create order. Please try again.'
                ], 500);
            }
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Checkout validation failed', [
                'errors' => $e->errors(),
                'user_id' => $request->user()->id,
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Checkout error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during checkout. Please try again.'
            ], 500);
        }
    }
}