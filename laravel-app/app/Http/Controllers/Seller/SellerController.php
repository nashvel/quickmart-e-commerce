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

        return Inertia::render('Seller/Orders', [
            'orders' => $orders
        ]);
    }
}