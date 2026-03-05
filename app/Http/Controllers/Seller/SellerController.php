<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order\Order;
use App\Models\Store\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SellerController extends Controller
{
    /**
     * Show seller dashboard
     */
    public function dashboard()
    {
        return Inertia::render('Seller/Dashboard');
    }

    /**
     * Show seller orders
     */
    public function orders()
    {
        $userId = Auth::id();
        
        // Get the seller's store(s)
        $stores = Store::where('client_id', $userId)->pluck('id');
        
        // Get orders for the seller's stores
        $orders = Order::with(['customer', 'items.product', 'address'])
            ->whereIn('store_id', $stores)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'first_name' => $order->customer ? $order->customer->first_name : 'N/A',
                    'last_name' => $order->customer ? $order->customer->last_name : 'N/A',
                    'created_at' => $order->created_at->toISOString(),
                    'total_amount' => (float) $order->total_amount,
                    'status' => $order->status,
                    'delivery_full_name' => $order->address ? $order->address->name : 'N/A',
                    'delivery_phone' => $order->address ? $order->address->phone : 'N/A',
                    'line1' => $order->address ? $order->address->address_line_1 : 'N/A',
                    'line2' => $order->address ? $order->address->address_line_2 : null,
                    'city' => $order->address ? $order->address->city : 'N/A',
                    'province' => $order->address ? $order->address->province : 'N/A',
                    'zip_code' => $order->address ? $order->address->postal_code : 'N/A',
                    'latitude' => $order->address ? $order->address->latitude : null,
                    'longitude' => $order->address ? $order->address->longitude : null,
                    'rider_first_name' => null, // Add rider data if available
                    'rider_last_name' => null,
                    'items' => $order->items->map(function ($item) {
                        return [
                            'product_name' => $item->product ? $item->product->name : 'Unknown Product',
                            'product_image' => $item->product ? $item->product->image : 'default.png',
                            'quantity' => $item->quantity,
                            'price' => (float) $item->price,
                        ];
                    }),
                ];
            });

        return Inertia::render('Seller/Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Show seller chats
     */
    public function chat()
    {
        $userId = Auth::id();
        
        // Get the seller's store(s)
        $stores = Store::where('client_id', $userId)->get();
        $storeIds = $stores->pluck('id');
        
        // Get chats for the seller's stores
        $chats = \App\Models\Chat\Chat::whereIn('store_id', $storeIds)
            ->with(['customer:id,first_name,last_name', 'store:id,name'])
            ->withCount(['messages as unread_count' => function ($query) use ($userId) {
                $query->where('sender_id', '!=', $userId)
                    ->where('is_read', false);
            }])
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function ($chat) {
                return [
                    'id' => $chat->id,
                    'customer_id' => $chat->customer_id,
                    'store_id' => $chat->store_id,
                    'customer_name' => $chat->customer 
                        ? $chat->customer->first_name . ' ' . $chat->customer->last_name 
                        : 'Unknown Customer',
                    'store_name' => $chat->store ? $chat->store->name : 'Unknown Store',
                    'last_message_at' => $chat->last_message_at,
                    'unread_count' => $chat->unread_count ?? 0,
                ];
            });

        return Inertia::render('Seller/Chat', [
            'chats' => $chats,
            'stores' => $stores
        ]);
    }
    
    /**
     * Accept an order
     */
    public function acceptOrder(Request $request, Order $order)
    {
        $userId = Auth::id();
        
        // Verify seller owns the store
        $store = Store::where('client_id', $userId)
            ->where('id', $order->store_id)
            ->first();
        
        if (!$store) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Only accept pending orders
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Order cannot be accepted'], 400);
        }
        
        $order->update(['status' => 'accepted']);
        
        return response()->json([
            'success' => true,
            'message' => 'Order accepted successfully',
            'order' => $order
        ]);
    }
    
    /**
     * Decline an order
     */
    public function declineOrder(Request $request, Order $order)
    {
        $userId = Auth::id();
        
        // Verify seller owns the store
        $store = Store::where('client_id', $userId)
            ->where('id', $order->store_id)
            ->first();
        
        if (!$store) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Only decline pending orders
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Order cannot be declined'], 400);
        }
        
        $order->update(['status' => 'rejected']);
        
        return response()->json([
            'success' => true,
            'message' => 'Order declined',
            'order' => $order
        ]);
    }
}