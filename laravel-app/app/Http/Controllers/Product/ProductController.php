<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\Product;
use App\Models\Product\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display products page
     */
    public function index(Request $request)
    {
        $query = Product::with(['store', 'category', 'variants'])
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
        $categories = Category::all();

        return Inertia::render('Products/Index', [
            'products' => $products->items(), // Return just the items array
            'pagination' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Display product detail
     */
    public function show(Product $product)
    {
        $product->load(['store', 'category', 'variants', 'addons']);

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Get products via API
     */
    public function getProducts(Request $request)
    {
        $query = Product::with(['store', 'category', 'variants'])
            ->active()
            ->approved();

        // Filter by store type
        if ($request->has('store_type')) {
            $query->whereHas('store', function ($q) use ($request) {
                $q->where('store_type', $request->store_type);
            });
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', '%' . $search . '%');
        }

        // Sort
        $sort = $request->get('sort', 'best-sellers');
        switch ($sort) {
            case 'price-asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price-desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name-asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name-desc':
                $query->orderBy('name', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $perPage = $request->get('perPage', 20);
        $products = $query->paginate($perPage);

        // Transform products to include necessary fields
        $transformedProducts = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'image' => $product->image,
                'stock' => $product->stock,
                'store_name' => $product->store ? $product->store->name : null,
                'product_type' => $product->product_type ?? 'single',
                'variants' => $product->variants ?? [],
                'rating' => $product->rating ?? null,
                'review_count' => $product->review_count ?? 0,
            ];
        });

        return response()->json([
            'products' => $transformedProducts,
            'pager' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
            ]
        ]);
    }
}
