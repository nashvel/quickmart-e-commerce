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
Route::get('/api/stores', [\App\Http\Controllers\Api\StoreApiController::class, 'index']);
Route::get('/api/stores/{store}', [\App\Http\Controllers\Api\StoreApiController::class, 'show']);

// Promotions API
Route::get('/api/promotions/active', [\App\Http\Controllers\Api\PromotionApiController::class, 'active']);

// Cart (public - guests can add to cart)
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::get('/api/cart', [CartController::class, 'getCart']);
Route::post('/api/cart', [CartController::class, 'store']);
Route::post('/api/cart/add', [CartController::class, 'store']); // Alias for adding to cart
Route::put('/api/cart/{cartItem}', [CartController::class, 'update']);
Route::delete('/api/cart/{cartItem}', [CartController::class, 'destroy']);
Route::delete('/api/cart', [CartController::class, 'clear']);

// Chat API (requires auth)
// Chat API (requires auth)
Route::middleware('auth')->group(function () {
    // Customer chat endpoints
    Route::get('/api/chats', [\App\Http\Controllers\ChatController::class, 'index']);
    Route::get('/api/chats/{store}/create', [\App\Http\Controllers\ChatController::class, 'getOrCreate']);
    Route::get('/api/chats/{chat}/messages', [\App\Http\Controllers\ChatController::class, 'messages']);
    Route::post('/api/chats/{chat}/messages', [\App\Http\Controllers\ChatController::class, 'sendMessage']);
    Route::delete('/api/chats/{chat}', [\App\Http\Controllers\ChatController::class, 'destroy']);
    
    // Seller chat endpoints
    Route::prefix('api/seller')->name('api.seller.')->group(function () {
        Route::get('/chats', [\App\Http\Controllers\Seller\SellerChatController::class, 'index']);
        Route::get('/chats/{chat}/messages', [\App\Http\Controllers\Seller\SellerChatController::class, 'messages']);
        Route::post('/chats/{chat}/messages', [\App\Http\Controllers\Seller\SellerChatController::class, 'sendMessage']);
    });
});

// Protected routes
Route::middleware('auth')->group(function () {
    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/api/checkout', [CheckoutController::class, 'processCheckout']);
    
    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('/track-order/{order}', [OrderController::class, 'track'])->name('orders.track');
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
    
    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/api/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
    Route::get('/api/notifications/unread-count', [\App\Http\Controllers\NotificationController::class, 'unreadCount']);
    Route::post('/api/notifications/{notification}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);
    Route::post('/api/notifications/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
    Route::delete('/api/notifications/{notification}', [\App\Http\Controllers\NotificationController::class, 'destroy']);
    
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
        Route::post('/orders/{order}/accept', [\App\Http\Controllers\Seller\SellerController::class, 'acceptOrder'])->name('orders.accept');
        Route::post('/orders/{order}/decline', [\App\Http\Controllers\Seller\SellerController::class, 'declineOrder'])->name('orders.decline');
        
        Route::get('/reviews', function () {
            return Inertia::render('Seller/Reviews');
        })->name('reviews');
        
        Route::get('/chat', [\App\Http\Controllers\Seller\SellerController::class, 'chat'])->name('chat');
        
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
