<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Store\Store;
use App\Models\Order\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /**
     * Show admin dashboard
     */
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard');
    }

    /**
     * Show users management page
     */
    public function users()
    {
        $currentUserId = Auth::id();
        
        $users = User::where('id', '!=', $currentUserId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'is_verified' => $user->is_verified,
                    'created_at' => $user->created_at->format('M d, Y'),
                    'status' => $user->is_verified ? 'active' : 'pending',
                ];
            });

        return Inertia::render('Admin/Users', [
            'users' => $users
        ]);
    }

    /**
     * Show stores management page
     */
    public function stores()
    {
        $stores = Store::with('client')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($store) {
                return [
                    'id' => $store->id,
                    'name' => $store->name,
                    'description' => $store->description,
                    'address' => $store->address,
                    'store_type' => $store->store_type,
                    'is_active' => $store->is_active,
                    'owner' => $store->client ? $store->client->first_name . ' ' . $store->client->last_name : 'N/A',
                    'owner_email' => $store->client ? $store->client->email : 'N/A',
                    'created_at' => $store->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Admin/Stores', [
            'stores' => $stores
        ]);
    }

    /**
     * Show orders management page
     */
    public function orders()
    {
        $orders = Order::with(['customer', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_name' => $order->customer ? $order->customer->first_name . ' ' . $order->customer->last_name : 'N/A',
                    'customer_email' => $order->customer ? $order->customer->email : 'N/A',
                    'total_amount' => (float) $order->total_amount, // Ensure it's a number
                    'status' => $order->status,
                    'items_count' => $order->items->count(),
                    'created_at' => $order->created_at->format('M d, Y H:i'),
                ];
            });

        return Inertia::render('Admin/Orders', [
            'orders' => $orders
        ]);
    }

    /**
     * Show promotions management page
     */
    public function promotions()
    {
        // For now, return mock data since promotions table doesn't exist yet
        $promotions = [
            [
                'id' => 1,
                'title' => '50% Off Electronics',
                'description' => 'Get 50% off on all electronics items',
                'discount_type' => 'percentage',
                'discount_value' => 50,
                'scope_type' => 'category',
                'scope_value' => 'Electronics',
                'start_date' => now()->subDays(1)->format('M d, Y'),
                'end_date' => now()->addDays(30)->format('M d, Y'),
                'is_active' => true,
            ],
            [
                'id' => 2,
                'title' => 'Free Delivery',
                'description' => 'Free delivery on orders above ₱500',
                'discount_type' => 'fixed',
                'discount_value' => 0,
                'scope_type' => 'all_products',
                'scope_value' => null,
                'start_date' => now()->subDays(5)->format('M d, Y'),
                'end_date' => now()->addDays(15)->format('M d, Y'),
                'is_active' => true,
            ],
            [
                'id' => 3,
                'title' => 'Buy 2 Get 1 Free',
                'description' => 'Buy 2 items and get 1 free on selected products',
                'discount_type' => 'fixed',
                'discount_value' => 0,
                'scope_type' => 'store',
                'scope_value' => 'Tech World',
                'start_date' => now()->subDays(2)->format('M d, Y'),
                'end_date' => now()->addDays(20)->format('M d, Y'),
                'is_active' => true,
            ],
        ];

        return Inertia::render('Admin/Promotions', [
            'promotions' => $promotions
        ]);
    }

    /**
     * Show settings page
     */
    public function settings()
    {
        return Inertia::render('Admin/Settings');
    }
}