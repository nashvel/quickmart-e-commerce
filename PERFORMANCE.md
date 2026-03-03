# ⚡ Performance Optimizations

## Database Optimizations

### 1. Strategic Indexes
All tables have been optimized with strategic indexes for fast queries:

#### Products Table
- `name` - Indexed for search
- `price` - Indexed for price sorting
- `stock` - Indexed for stock queries
- `is_active`, `is_approved` - Indexed for filtering
- **Composite indexes**:
  - `(store_id, is_active, is_approved)` - Store products listing
  - `(category_id, is_active, is_approved)` - Category filtering
  - `(is_approved, created_at)` - Admin approval queue

#### Orders Table
- `status` - Indexed for status filtering
- **Composite indexes**:
  - `(customer_id, status, created_at)` - Customer order history
  - `(store_id, status, created_at)` - Store orders
  - `(rider_id, status)` - Rider orders
  - `(status, created_at)` - Admin order management

#### Cart Items Table
- **Composite index**: `(user_id, created_at)` - Fast cart retrieval
- **Unique constraint**: `(user_id, product_id, variant_id)` - Prevent duplicates

#### Stores Table
- `name` - Indexed for search
- `store_type` - Indexed for filtering
- `is_active` - Indexed for active stores
- **Composite indexes**:
  - `(is_active, store_type)` - Active stores by type
  - `(latitude, longitude)` - Location-based queries

#### Addresses Table
- `city` - Indexed for city-based queries
- **Composite indexes**:
  - `(user_id, is_default)` - Get user's default address
  - `(latitude, longitude)` - Location-based queries

### 2. Foreign Key Constraints
- **CASCADE**: Delete related records automatically (cart items, order items)
- **RESTRICT**: Prevent deletion if referenced (products in orders)
- **SET NULL**: Keep records but remove reference (rider in orders)

### 3. Data Types
- **DECIMAL(10,2)** for prices - Precise money calculations
- **ENUM** for status fields - Fast comparisons
- **VARCHAR** with appropriate lengths - Optimize storage
- **JSON** for flexible attributes - Store variant attributes

## Query Optimizations

### 1. Eager Loading
Always use `with()` to prevent N+1 queries:

```php
// ❌ Bad - N+1 queries
$orders = Order::all();
foreach ($orders as $order) {
    echo $order->customer->name; // Extra query per order
}

// ✅ Good - 2 queries total
$orders = Order::with('customer')->get();
foreach ($orders as $order) {
    echo $order->customer->name;
}
```

### 2. Select Only Needed Columns
```php
// ❌ Bad - Fetch all columns
$products = Product::all();

// ✅ Good - Fetch only needed columns
$products = Product::select('id', 'name', 'price')->get();
```

### 3. Pagination
Always paginate large datasets:
```php
// ✅ Good
$products = Product::paginate(20);
```

### 4. Chunk Large Datasets
For processing many records:
```php
Product::chunk(100, function ($products) {
    foreach ($products as $product) {
        // Process product
    }
});
```

## Caching Strategy

### 1. Query Caching
Cache expensive queries:
```php
$categories = Cache::remember('categories', 3600, function () {
    return Category::with('children')->get();
});
```

### 2. Model Caching
Cache frequently accessed models:
```php
$product = Cache::remember("product.{$id}", 3600, function () use ($id) {
    return Product::with('variants', 'addons')->find($id);
});
```

### 3. Cache Tags (Redis)
Group related caches:
```php
Cache::tags(['products', 'store:'.$storeId])->put($key, $value, 3600);
Cache::tags(['products'])->flush(); // Clear all product caches
```

## Frontend Optimizations

### 1. Code Splitting
Inertia automatically code-splits pages:
```tsx
// Each page is loaded only when needed
import('./Pages/Products/Index.tsx')
```

### 2. Lazy Loading
Use React.lazy for heavy components:
```tsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

### 3. Memoization
Use React.memo for expensive components:
```tsx
const ProductCard = React.memo(({ product }) => {
    // Component code
});
```

### 4. Debouncing
Debounce search inputs:
```tsx
const debouncedSearch = useMemo(
    () => debounce((value) => {
        // Search logic
    }, 300),
    []
);
```

## API Optimizations

### 1. Resource Transformers
Use API resources to control response data:
```php
return ProductResource::collection($products);
```

### 2. Conditional Loading
Load relationships only when needed:
```php
$product = Product::when($request->include_variants, function ($query) {
    $query->with('variants');
})->find($id);
```

### 3. Response Caching
Cache API responses:
```php
return Cache::remember("api.products.{$page}", 300, function () {
    return Product::paginate(20);
});
```

## Server Optimizations

### 1. OPcache
Enable PHP OPcache in production:
```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
```

### 2. Queue Jobs
Move slow tasks to queues:
```php
// Send email asynchronously
SendOrderConfirmationEmail::dispatch($order);
```

### 3. Database Connection Pooling
Use persistent connections:
```env
DB_CONNECTION=mysql
DB_PERSISTENT=true
```

### 4. CDN for Assets
Serve static assets from CDN:
```env
ASSET_URL=https://cdn.example.com
```

## Monitoring

### 1. Query Logging
Monitor slow queries:
```php
DB::listen(function ($query) {
    if ($query->time > 100) {
        Log::warning('Slow query', [
            'sql' => $query->sql,
            'time' => $query->time
        ]);
    }
});
```

### 2. Laravel Telescope
Install for development monitoring:
```bash
composer require laravel/telescope --dev
```

### 3. Laravel Debugbar
Monitor queries in development:
```bash
composer require barryvdh/laravel-debugbar --dev
```

## Production Checklist

- [ ] Enable OPcache
- [ ] Configure Redis for cache/sessions
- [ ] Set up queue workers
- [ ] Enable response caching
- [ ] Optimize images (WebP, lazy loading)
- [ ] Enable Gzip compression
- [ ] Use CDN for assets
- [ ] Set up database read replicas
- [ ] Configure horizontal scaling
- [ ] Monitor with New Relic/Datadog

## Expected Performance

With these optimizations:
- **Page Load**: < 200ms
- **API Response**: < 100ms
- **Database Queries**: < 50ms
- **Cart Operations**: < 30ms
- **Search**: < 100ms

## Benchmarks

```bash
# Run benchmarks
php artisan benchmark:products
php artisan benchmark:orders
php artisan benchmark:cart
```

---

**Fast by design! ⚡**
