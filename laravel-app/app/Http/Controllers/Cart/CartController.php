<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Requests\Cart\UpdateCartRequest;
use App\Models\Cart\CartItem;
use App\Models\Cart\CartItemAddon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display cart page
     */
    public function index()
    {
        return Inertia::render('Cart/Index');
    }

    /**
     * Get cart items via API
     */
    public function getCart(Request $request)
    {
        $query = CartItem::with(['product', 'variant', 'addons.addon']);
        
        if ($request->user()) {
            $query->where('user_id', $request->user()->id);
        } else {
            $sessionId = $request->session()->getId();
            $query->where('session_id', $sessionId);
        }
        
        $cartItems = $query->get();
        $totalPrice = $cartItems->sum('total_price');

        return response()->json([
            'cart_items' => $cartItems,
            'total_price' => $totalPrice,
            'count' => $cartItems->sum('quantity'),
        ]);
    }

    /**
     * Add item to cart
     */
    public function store(AddToCartRequest $request)
    {
        $validated = $request->validated();

        // Determine if user is authenticated or guest
        $userId = $request->user() ? $request->user()->id : null;
        $sessionId = $userId ? null : $request->session()->getId();

        // Check if item already exists in cart
        $existingItem = CartItem::where('product_id', $validated['product_id'])
            ->where('variant_id', $validated['variant_id'] ?? null)
            ->where(function ($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })
            ->first();

        if ($existingItem) {
            // Update quantity if item exists
            $existingItem->quantity += $validated['quantity'] ?? 1;
            $existingItem->save();
            $cartItem = $existingItem;
        } else {
            // Create new cart item
            $cartItem = CartItem::create([
                'user_id' => $userId,
                'session_id' => $sessionId,
                'product_id' => $validated['product_id'],
                'variant_id' => $validated['variant_id'] ?? null,
                'quantity' => $validated['quantity'] ?? 1,
            ]);
        }

        // Add addons if provided
        if (isset($validated['addons']) && is_array($validated['addons'])) {
            foreach ($validated['addons'] as $addon) {
                CartItemAddon::create([
                    'cart_item_id' => $cartItem->id,
                    'addon_id' => $addon['addon_id'],
                    'addon_variant_id' => $addon['addon_variant_id'] ?? null,
                    'quantity' => $addon['quantity'] ?? 1,
                    'price' => $addon['price'],
                ]);
            }
        }

        return response()->json([
            'message' => 'Item added to cart',
            'cart_item' => $cartItem->load(['product', 'variant', 'addons']),
        ], 201);
    }

    /**
     * Update cart item quantity
     */
    public function update(UpdateCartRequest $request, CartItem $cartItem)
    {
        // Ensure user/guest owns this cart item
        if ($request->user()) {
            if ($cartItem->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } else {
            if ($cartItem->session_id !== $request->session()->getId()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $cartItem->update($request->validated());

        return response()->json([
            'message' => 'Cart updated',
            'cart_item' => $cartItem->load(['product', 'variant', 'addons']),
        ]);
    }

    /**
     * Remove item from cart
     */
    public function destroy(Request $request, CartItem $cartItem)
    {
        // Ensure user/guest owns this cart item
        if ($request->user()) {
            if ($cartItem->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } else {
            if ($cartItem->session_id !== $request->session()->getId()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart']);
    }

    /**
     * Clear entire cart
     */
    public function clear(Request $request)
    {
        if ($request->user()) {
            CartItem::where('user_id', $request->user()->id)->delete();
        } else {
            CartItem::where('session_id', $request->session()->getId())->delete();
        }

        return response()->json(['message' => 'Cart cleared']);
    }
}
