<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store\Store;
use Illuminate\Http\Request;

class StoreApiController extends Controller
{
    /**
     * Get all active stores
     */
    public function index(Request $request)
    {
        $query = Store::where('is_active', true);
        
        // Filter by type if provided
        if ($request->has('type')) {
            $query->where('store_type', $request->type);
        }
        
        $stores = $query->get();
        
        return response()->json($stores);
    }
    
    /**
     * Get a specific store
     */
    public function show($storeId)
    {
        $store = Store::where('is_active', true)->findOrFail($storeId);
        
        return response()->json($store);
    }
}
