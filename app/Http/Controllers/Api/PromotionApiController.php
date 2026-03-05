<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PromotionApiController extends Controller
{
    /**
     * Get active promotions
     */
    public function active()
    {
        try {
            // For now, return mock data since we don't have promotions table yet
            $promotions = [
                [
                    'id' => 1,
                    'title' => '50% Off Electronics',
                    'description' => 'Get 50% off on all electronics items',
                    'discount_type' => 'percentage',
                    'discount_value' => 50,
                    'scope_type' => 'category',
                    'scope_value' => 'Electronics',
                    'start_date' => now()->subDays(1)->toISOString(),
                    'end_date' => now()->addDays(30)->toISOString(),
                    'is_active' => true,
                    'image' => 'electronics-sale.jpg',
                ],
                [
                    'id' => 2,
                    'title' => 'Free Delivery',
                    'description' => 'Free delivery on orders above ₱500',
                    'discount_type' => 'fixed',
                    'discount_value' => 0,
                    'scope_type' => 'all_products',
                    'scope_value' => null,
                    'start_date' => now()->subDays(5)->toISOString(),
                    'end_date' => now()->addDays(15)->toISOString(),
                    'is_active' => true,
                    'image' => 'free-delivery.jpg',
                ],
                [
                    'id' => 3,
                    'title' => 'Buy 2 Get 1 Free',
                    'description' => 'Buy 2 items and get 1 free on selected products',
                    'discount_type' => 'fixed',
                    'discount_value' => 0,
                    'scope_type' => 'store',
                    'scope_value' => 'Tech World',
                    'start_date' => now()->subDays(2)->toISOString(),
                    'end_date' => now()->addDays(20)->toISOString(),
                    'is_active' => true,
                    'image' => 'buy2get1.jpg',
                ],
            ];
            
            return response()->json(['promotions' => $promotions]);
        } catch (\Exception $e) {
            \Log::error('Promotions API error: ' . $e->getMessage());
            return response()->json(['promotions' => []], 200);
        }
    }
}
