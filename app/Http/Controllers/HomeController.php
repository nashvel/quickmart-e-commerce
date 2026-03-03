<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product\Product;
use App\Models\Product\Category;
use App\Models\Store\Store;

class HomeController extends Controller
{
    public function index()
    {
        // Get featured products (top 10 by sales or random if no sales data)
        $featuredProducts = Product::with(['store', 'category'])
            ->where('is_active', true)
            ->where('is_approved', true)
            ->inRandomOrder()
            ->limit(10)
            ->get();

        // Get all categories
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->get();

        // Get stores
        $stores = Store::where('is_active', true)
            ->limit(12)
            ->get();

        // Get convenience stores
        $convenienceStores = Store::where('is_active', true)
            ->where('store_type', 'convenience')
            ->limit(6)
            ->get();

        // Get restaurants
        $restaurants = Store::where('is_active', true)
            ->where('store_type', 'restaurant')
            ->limit(6)
            ->get();

        return Inertia::render('Welcome', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'stores' => $stores,
            'convenienceStores' => $convenienceStores,
            'restaurants' => $restaurants,
        ]);
    }
}
