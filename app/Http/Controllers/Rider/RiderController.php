<?php

namespace App\Http\Controllers\Rider;

use App\Http\Controllers\Controller;
use App\Models\Order\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RiderController extends Controller
{
    /**
     * Show rider dashboard
     */
    public function dashboard()
    {
        $riderId = Auth::id();
        
        // Get today's earnings (sum of delivery fees for delivered orders today)
        $todayEarnings = Order::where('rider_id', $riderId)
            ->where('status', 'delivered')
            ->whereDate('updated_at', today())
            ->sum('delivery_fee') ?? 0;
        
        // Get completed trips count (all delivered orders)
        $completedTrips = Order::where('rider_id', $riderId)
            ->where('status', 'delivered')
            ->count();
        
        // Get active deliveries (accepted or in_transit)
        $activeDeliveries = Order::where('rider_id', $riderId)
            ->whereIn('status', ['accepted', 'in_transit'])
            ->count();
        
        // Get weekly earnings data (last 7 days)
        $weeklyData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = today()->subDays($i);
            $earnings = Order::where('rider_id', $riderId)
                ->where('status', 'delivered')
                ->whereDate('updated_at', $date)
                ->sum('delivery_fee') ?? 0;
            
            $weeklyData[] = [
                'day' => $date->format('D'),
                'earnings' => (float) $earnings
            ];
        }
        
        // Get assigned orders (accepted and in_transit)
        $assignedOrders = Order::with(['customer', 'items.product', 'address', 'store'])
            ->where('rider_id', $riderId)
            ->whereIn('status', ['accepted', 'in_transit'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_name' => $order->customer 
                        ? $order->customer->first_name . ' ' . $order->customer->last_name 
                        : 'N/A',
                    'delivery_address' => $order->address 
                        ? $order->address->address_line_1 . ', ' . $order->address->city 
                        : 'N/A',
                    'phone' => $order->address ? $order->address->phone : 'N/A',
                    'total_amount' => (float) $order->total_amount,
                    'status' => $order->status,
                    'items_count' => $order->items->count(),
                    'store_name' => $order->store ? $order->store->name : 'N/A',
                    'latitude' => $order->address ? $order->address->latitude : null,
                    'longitude' => $order->address ? $order->address->longitude : null,
                ];
            });
        
        return Inertia::render('Rider/Dashboard', [
            'stats' => [
                'todayEarnings' => (float) $todayEarnings,
                'completedTrips' => $completedTrips,
                'activeDeliveries' => $activeDeliveries
            ],
            'weeklyData' => $weeklyData,
            'assignedOrders' => $assignedOrders
        ]);
    }

    /**
     * Show rider deliveries
     */
    public function deliveries()
    {
        $riderId = Auth::id();
        
        // Get orders assigned to this rider
        $orders = Order::with(['customer', 'items.product', 'address', 'store'])
            ->where('rider_id', $riderId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_name' => $order->customer 
                        ? $order->customer->first_name . ' ' . $order->customer->last_name 
                        : 'N/A',
                    'delivery_address' => $order->address 
                        ? $order->address->address_line_1 . ', ' . $order->address->city 
                        : 'N/A',
                    'phone' => $order->address ? $order->address->phone : 'N/A',
                    'total_amount' => (float) $order->total_amount,
                    'status' => $order->status,
                    'items_count' => $order->items->count(),
                    'created_at' => $order->created_at->toISOString(),
                    'store_name' => $order->store ? $order->store->name : 'N/A',
                    'latitude' => $order->address ? $order->address->latitude : null,
                    'longitude' => $order->address ? $order->address->longitude : null,
                ];
            });

        return Inertia::render('Rider/Deliveries', [
            'orders' => $orders
        ]);
    }

    /**
     * Start delivery (change status from accepted to in_transit)
     */
    public function startDelivery(Request $request, Order $order)
    {
        $riderId = Auth::id();
        
        // Verify rider owns this order
        if ($order->rider_id !== $riderId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Only start delivery for accepted orders
        if ($order->status !== 'accepted' && $order->status !== 'in_transit') {
            return response()->json(['message' => 'Order cannot be started'], 400);
        }
        
        $order->update(['status' => 'in_transit']);
        
        return response()->json([
            'success' => true,
            'message' => 'Delivery started',
            'order' => $order
        ]);
    }

    /**
     * Mark order as delivered
     */
    public function markDelivered(Request $request, Order $order)
    {
        $riderId = Auth::id();
        
        // Verify rider owns this order
        if ($order->rider_id !== $riderId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Only mark delivered for in_transit orders
        if ($order->status !== 'in_transit') {
            return response()->json(['message' => 'Order must be in transit'], 400);
        }
        
        $order->update(['status' => 'delivered']);
        
        return response()->json([
            'success' => true,
            'message' => 'Order marked as delivered',
            'order' => $order
        ]);
    }

    /**
     * Show rider earnings
     */
    public function earnings()
    {
        $riderId = Auth::id();
        
        // Get all transactions (delivered orders)
        $transactions = Order::with(['customer', 'store'])
            ->where('rider_id', $riderId)
            ->where('status', 'delivered')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'date' => $order->updated_at->toISOString(),
                    'order_id' => $order->id,
                    'amount' => (float) ($order->delivery_fee ?? 0),
                    'type' => 'delivery',
                    'customer_name' => $order->customer 
                        ? $order->customer->first_name . ' ' . $order->customer->last_name 
                        : 'N/A',
                    'store_name' => $order->store ? $order->store->name : 'N/A'
                ];
            });
        
        // Calculate total earnings
        $totalEarnings = $transactions->sum('amount');
        
        // Calculate available balance (total earnings - withdrawals)
        // For now, same as total earnings (no withdrawal system yet)
        $availableBalance = $totalEarnings;
        
        // Get weekly earnings (last 7 days)
        $weeklyEarnings = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = today()->subDays($i);
            $earnings = Order::where('rider_id', $riderId)
                ->where('status', 'delivered')
                ->whereDate('updated_at', $date)
                ->sum('delivery_fee') ?? 0;
            
            $weeklyEarnings[] = [
                'day' => $date->format('D'),
                'earnings' => (float) $earnings
            ];
        }
        
        // Get monthly earnings (last 6 months)
        $monthlyEarnings = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = today()->subMonths($i);
            $earnings = Order::where('rider_id', $riderId)
                ->where('status', 'delivered')
                ->whereYear('updated_at', $date->year)
                ->whereMonth('updated_at', $date->month)
                ->sum('delivery_fee') ?? 0;
            
            $monthlyEarnings[] = [
                'month' => $date->format('M'),
                'earnings' => (float) $earnings
            ];
        }
        
        // Calculate this week's earnings
        $thisWeekEarnings = Order::where('rider_id', $riderId)
            ->where('status', 'delivered')
            ->whereBetween('updated_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->sum('delivery_fee') ?? 0;
        
        return Inertia::render('Rider/Earnings', [
            'transactions' => $transactions,
            'totalEarnings' => (float) $totalEarnings,
            'availableBalance' => (float) $availableBalance,
            'weeklyEarnings' => $weeklyEarnings,
            'monthlyEarnings' => $monthlyEarnings,
            'thisWeekEarnings' => (float) $thisWeekEarnings
        ]);
    }
}
