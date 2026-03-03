# Laravel MVC Structure - Organized by Feature

## 📁 New Project Structure

We've installed a fresh Laravel 11 application with a clean, organized MVC structure grouped by feature.

### Structure Pattern

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Cart/
│   │   │   └── CartController.php
│   │   ├── Product/
│   │   │   ├── ProductController.php
│   │   │   └── CategoryController.php
│   │   ├── Order/
│   │   │   └── OrderController.php
│   │   └── Auth/
│   │       └── AuthController.php
│   └── Requests/
│       ├── Cart/
│       │   ├── AddToCartRequest.php
│       │   └── UpdateCartRequest.php
│       ├── Product/
│       │   └── StoreProductRequest.php
│       └── Order/
│           └── PlaceOrderRequest.php
├── Models/
│   ├── User.php
│   ├── Cart/
│   │   ├── CartItem.php
│   │   └── CartItemAddon.php
│   ├── Product/
│   │   ├── Product.php
│   │   ├── ProductVariant.php
│   │   └── Category.php
│   ├── Order/
│   │   ├── Order.php
│   │   └── OrderItem.php
│   ├── AddOn/
│   │   ├── AddOn.php
│   │   └── AddOnVariant.php
│   └── Address/
│       └── Address.php
└── Services/ (optional)
    ├── Cart/
    │   └── CartService.php
    └── Order/
        └── OrderService.php
```

## ✅ What's Been Created

### Cart Feature (Complete Example)

1. **Model**: `app/Models/Cart/CartItem.php`
   - Relationships: user, product, variant, addons
   - Accessor: `total_price`
   - Eloquent features

2. **Model**: `app/Models/Cart/CartItemAddon.php`
   - Relationships: cartItem, addon, addonVariant
   - Price tracking

3. **Controller**: `app/Http/Controllers/Cart/CartController.php`
   - `index()` - Display cart page (Inertia)
   - `getCart()` - Get cart items via API
   - `store()` - Add to cart
   - `update()` - Update quantity
   - `destroy()` - Remove item
   - `clear()` - Clear cart

4. **Requests**: 
   - `app/Http/Requests/Cart/AddToCartRequest.php`
   - `app/Http/Requests/Cart/UpdateCartRequest.php`

### Frontend (Already Created)

All frontend pages from before are copied to:
```
resources/js/
├── Pages/
│   ├── Auth/
│   ├── Products/
│   ├── Cart/
│   ├── Checkout/
│   ├── Orders/
│   ├── Chat/
│   ├── Seller/
│   └── Admin/
├── Components/
├── Layouts/
├── Hooks/
└── types/
```

## 🚀 Installed Packages

- ✅ Laravel 11
- ✅ Inertia.js Laravel adapter
- ✅ Laravel Sanctum (API authentication)
- ✅ Ziggy (route helper for frontend)

## 📝 Next Steps

### 1. Create Remaining Models

Follow the Cart pattern for:
- Product (Product, ProductVariant, Category)
- Order (Order, OrderItem, OrderItemAddon)
- AddOn (AddOn, AddOnVariant, AddOnCategory)
- Address (Address)
- Store (Store)
- Chat (Chat, ChatMessage)
- Notification (Notification)

### 2. Create Controllers

Follow the CartController pattern for:
- ProductController
- OrderController
- AuthController
- AddressController
- StoreController
- ChatController

### 3. Create Migrations

```bash
php artisan make:migration create_products_table
php artisan make:migration create_cart_items_table
php artisan make:migration create_orders_table
# etc...
```

### 4. Set Up Routes

In `routes/web.php`:
```php
use App\Http\Controllers\Cart\CartController;

Route::middleware('auth')->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::get('/api/cart', [CartController::class, 'getCart']);
    Route::post('/api/cart', [CartController::class, 'store']);
    Route::put('/api/cart/{cartItem}', [CartController::class, 'update']);
    Route::delete('/api/cart/{cartItem}', [CartController::class, 'destroy']);
    Route::delete('/api/cart', [CartController::class, 'clear']);
});
```

### 5. Install Frontend Dependencies

```bash
npm install
npm run dev
```

### 6. Configure Database

Update `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=quickmart
DB_USERNAME=root
DB_PASSWORD=
```

### 7. Run Migrations

```bash
php artisan migrate
```

### 8. Run Tests

```bash
php artisan test
```

## 🎯 Benefits of This Structure

### 1. **Organized by Feature**
- All Cart-related code in one place
- Easy to find and maintain
- Clear separation of concerns

### 2. **Standard Laravel MVC**
- Follows Laravel conventions
- Easy for any Laravel developer to understand
- No custom architecture to learn

### 3. **Scalable**
- Add new features by creating new folders
- Each feature is self-contained
- Easy to refactor or remove features

### 4. **Clean**
- No complex module system
- Simple autoloading
- Standard PSR-4 namespacing

## 📚 Example Usage

### Adding a Product Feature

1. Create model:
```bash
mkdir -p app/Models/Product
# Create Product.php, ProductVariant.php, Category.php
```

2. Create controller:
```bash
mkdir -p app/Http/Controllers/Product
# Create ProductController.php
```

3. Create requests:
```bash
mkdir -p app/Http/Requests/Product
# Create StoreProductRequest.php, UpdateProductRequest.php
```

4. Create migration:
```bash
php artisan make:migration create_products_table
```

5. Add routes in `routes/web.php`

## 🔄 Migration from Old Structure

The old modular structure in `app/Modules/` can be gradually migrated:

**Old**: `app/Modules/Cart/Controllers/CartController.php`
**New**: `app/Http/Controllers/Cart/CartController.php`

**Old**: `app/Modules/Cart/Models/CartItem.php`
**New**: `app/Models/Cart/CartItem.php`

**Old**: `app/Modules/Cart/Requests/AddToCartRequest.php`
**New**: `app/Http/Requests/Cart/AddToCartRequest.php`

## ✨ Clean & Simple

This structure is:
- ✅ Standard Laravel
- ✅ Easy to understand
- ✅ Easy to maintain
- ✅ Scalable
- ✅ No custom architecture
- ✅ Works with all Laravel tools
- ✅ Great for teams

---

**Ready to build! 🚀**
