<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Store\StoreController;
use App\Http\Controllers\Cart\CartController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\Address\AddressController;
use App\Http\Controllers\Checkout\CheckoutController;
use App\Models\Address\Address;
use App\Models\Order\Order;
use Inertia\Inertia;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// CSRF Token endpoint
Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

// Auth routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::get('/signup', [AuthController::class, 'showRegister'])->name('signup'); // Alias for register
Route::get('/forgot-password', function () {
    return Inertia::render('Auth/ForgotPassword');
})->name('password.request');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/signup', [AuthController::class, 'register']); // Alias for register
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Products (public)
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
Route::get('/api/products', [ProductController::class, 'getProducts']); // API endpoint

// Stores (public)
Route::get('/stores', [StoreController::class, 'index'])->name('stores.index');
Route::get('/stores/{store}/{slug?}', [StoreController::class, 'show'])->name('stores.show');

// Restaurants (public)
Route::get('/restaurants', [StoreController::class, 'index'])->defaults('type', 'restaurant')->name('restaurants.index');

// Promotions (public)
Route::get('/promotions', function () {
    return Inertia::render('Promotions/Index');
})->name('promotions.index');

// Help & Info Pages (public)
Route::get('/patch-notes', function () {
    return Inertia::render('Info/PatchNotes');
})->name('patch-notes');

Route::get('/faq', function () {
    return Inertia::render('Info/FAQ');
})->name('faq');

Route::get('/contact', function () {
    return Inertia::render('Info/Contact');
})->name('contact');

Route::get('/help-center', function () {
    return Inertia::render('Info/HelpCenter');
})->name('help-center');

Route::get('/partners', function () {
    return Inertia::render('Info/Partners');
})->name('partners');

// Appliances & PC Builder (public)
Route::get('/appliances', function () {
    return Inertia::render('Appliances/Index');
})->name('appliances.index');

Route::get('/pc-builder', function () {
    return Inertia::render('PCBuilder/Index');
})->name('pc-builder.index');

// Stores API
Route::get('/api/stores', function () {
    $type = request('type');
    $stores = \App\Models\Store\Store::where('is_active', true);
    
    if ($type) {
        $stores->where('store_type', $type);
    }
    
    return response()->json($stores->get());
});

Route::get('/api/stores/{store}', function ($storeId) {
    $store = \App\Models\Store\Store::where('is_active', true)->findOrFail($storeId);
    return response()->json($store);
});

// Promotions API
Route::get('/api/promotions/active', function () {
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
});

// Cart (public - guests can add to cart)
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::get('/api/cart', [CartController::class, 'getCart']);
Route::post('/api/cart', [CartController::class, 'store']);
Route::post('/api/cart/add', [CartController::class, 'store']); // Alias for adding to cart
Route::put('/api/cart/{cartItem}', [CartController::class, 'update']);
Route::delete('/api/cart/{cartItem}', [CartController::class, 'destroy']);
Route::delete('/api/cart', [CartController::class, 'clear']);

// Protected routes
Route::middleware('auth')->group(function () {
    // Checkout (requires auth)
    Route::get('/checkout', function () {
        $addresses = auth()->user()->addresses()->orderBy('is_default', 'desc')->get()->map(function ($address) {
            return [
                'id' => $address->id,
                'name' => $address->name,
                'address_line' => $address->address_line_1, // For backward compatibility
                'address_line_1' => $address->address_line_1,
                'address_line_2' => $address->address_line_2,
                'city' => $address->city,
                'province' => $address->province,
                'postal_code' => $address->postal_code,
                'type' => $address->type,
                'latitude' => $address->latitude,
                'longitude' => $address->longitude,
                'is_default' => $address->is_default,
            ];
        });
        
        return Inertia::render('Checkout/Index', [
            'addresses' => $addresses,
        ]);
    })->name('checkout');
    
    // Checkout API
    Route::post('/api/checkout', [CheckoutController::class, 'processCheckout']);
    
    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('/track-order/{order}', function (Order $order) {
        // Ensure user owns this order
        if ($order->customer_id !== auth()->id()) {
            abort(403);
        }

        // Load order with items and products
        $order->load(['items.product', 'address']);

        // Format the order data for the frontend
        $formattedOrder = [
            'id' => $order->id,
            'created_at' => $order->created_at->toISOString(),
            'status' => $order->status,
            'estimated_delivery_time' => null, // Add if you have this field
            'items' => $order->items->map(function ($item) {
                return [
                    'name' => $item->product ? $item->product->name : 'Unknown Product',
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ];
            }),
            'rider' => null, // Add rider data if available
            'customer' => null, // Add customer location if available
        ];

        return Inertia::render('Orders/Track', ['order' => $formattedOrder]);
    })->name('orders.track');
    Route::get('/order-success', function () {
        return Inertia::render('Orders/Success');
    })->name('orders.success');
    Route::get('/api/orders', [OrderController::class, 'getOrders']);
    Route::post('/api/orders', [OrderController::class, 'store']);
    Route::post('/api/orders/{order}/cancel', [OrderController::class, 'cancel']);
    
    // Addresses
    Route::get('/api/addresses', [AddressController::class, 'index']);
    Route::post('/api/addresses', [AddressController::class, 'store']);
    Route::put('/api/addresses/{address}', [AddressController::class, 'update']);
    Route::delete('/api/addresses/{address}', [AddressController::class, 'destroy']);
    
    // Profile
    Route::get('/profile', function () {
        return Inertia::render('Profile/Index');
    })->name('profile');
    
    Route::get('/profile/settings', function () {
        return Inertia::render('Profile/Settings');
    })->name('profile.settings');
    
    Route::get('/profile/addresses', function () {
        return Inertia::render('Profile/Addresses');
    })->name('profile.addresses');
    
    Route::get('/profile/notifications', function () {
        return Inertia::render('Profile/Notifications');
    })->name('profile.notifications');
    
    Route::get('/profile/payment-methods', function () {
        return Inertia::render('Profile/PaymentMethods');
    })->name('profile.payment-methods');
    
    // Chat
    Route::get('/chat', function () {
        return Inertia::render('Chat/Index');
    })->name('chat');
    
    // Seller Routes
    Route::prefix('seller')->name('seller.')->middleware(['auth', 'client'])->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Seller\SellerController::class, 'dashboard'])->name('dashboard');
        
        Route::get('/products/manage', function () {
            return Inertia::render('Seller/Products/Manage');
        })->name('products.manage');
        
        Route::get('/products/add', function () {
            return Inertia::render('Seller/Products/Add');
        })->name('products.add');
        
        Route::get('/orders', [\App\Http\Controllers\Seller\SellerController::class, 'orders'])->name('orders');
        
        Route::get('/reviews', function () {
            return Inertia::render('Seller/Reviews');
        })->name('reviews');
        
        Route::get('/chat', function () {
            return Inertia::render('Seller/Chat');
        })->name('chat');
        
        Route::get('/manage-store', function () {
            return Inertia::render('Seller/ManageStore');
        })->name('store.manage');
    });
    
    // Admin Routes
    Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Admin\AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/users', [\App\Http\Controllers\Admin\AdminController::class, 'users'])->name('users');
        Route::get('/stores', [\App\Http\Controllers\Admin\AdminController::class, 'stores'])->name('stores');
        Route::get('/orders', [\App\Http\Controllers\Admin\AdminController::class, 'orders'])->name('orders');
        Route::get('/promotions', [\App\Http\Controllers\Admin\AdminController::class, 'promotions'])->name('promotions');
        Route::get('/settings', [\App\Http\Controllers\Admin\AdminController::class, 'settings'])->name('settings');
    });
    
    // Rider Routes
    Route::prefix('rider')->name('rider.')->middleware(['auth', 'rider'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Rider/Dashboard');
        })->name('dashboard');
        
        Route::get('/deliveries', function () {
            return Inertia::render('Rider/Deliveries');
        })->name('deliveries');
        
        Route::get('/earnings', function () {
            return Inertia::render('Rider/Earnings');
        })->name('earnings');
    });
});

// 404 Fallback - Must be last
Route::fallback(function () {
    return Inertia::render('NotFound');
});
