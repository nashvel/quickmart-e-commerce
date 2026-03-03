<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Store\Store;
use App\Models\Product\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Display stores page
     */
    public function index(Request $request)
    {
        $query = Store::where('is_active', true);

        // Filter by store type
        if ($request->has('type')) {
            $query->where('store_type', $request->type);
        }

        // Search
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $stores = $query->paginate(12);

        // Determine which component to render based on type
        $component = $request->type === 'restaurant' ? 'Restaurants/Index' : 'Stores/Index';

        return Inertia::render($component, [
            'stores' => $stores->items(),
            'pagination' => [
                'total' => $stores->total(),
                'per_page' => $stores->perPage(),
                'current_page' => $stores->currentPage(),
                'last_page' => $stores->lastPage(),
            ],
        ]);
    }

    /**
     * Display store detail with products
     */
    public function show(Store $store, Request $request)
    {
        if (!$store->is_active) {
            abort(404);
        }

        // Get store products
        $query = Product::with(['category', 'variants'])
            ->where('store_id', $store->id)
            ->active()
            ->approved();

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->paginate(20);

        return Inertia::render('Stores/Show', [
            'store' => $store,
            'products' => $products->items(),
            'pagination' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
            ],
        ]);
    }
}
