# Seeder Migration Guide: CodeIgniter to Laravel

## Overview
Converting CodeIgniter seeders to Laravel seeders with exact data preservation.

---

## Seeders to Convert

### 1. CategorySeeder ✅
**Source**: `backend/app/Database/Seeds/CategorySeeder.php`
**Target**: `laravel-app/database/seeders/CategorySeeder.php`

**Data Structure**:
- 14 parent categories (Electronics, Fashion, Home & Kitchen, Books, Sports & Outdoors, Food & Grocery, Pizza, Burgers, Asian, Healthy, Desserts, Coffee, Fast Food, Seafood)
- Each parent has 4-6 subcategories
- Total: ~70 categories

**Key Fields**:
- name (string)
- icon (string) - Font Awesome classes
- parent_id (nullable)
- created_at, updated_at

---

### 2. StoreSeeder ✅
**Source**: `backend/app/Database/Seeds/StoreSeeder.php`
**Target**: `laravel-app/database/seeders/StoreSeeder.php`

**Data Structure**:
- 11 stores total
- 3 convenience stores (Tech World, Fashion Forward, Home Essentials)
- 8 restaurants (Pizza Palace, Burger Junction, Asian Fusion, Healthy Bites, Sweet Treats, Coffee Corner, Quick Bites, Ocean Delights)

**Key Fields**:
- client_id (foreign key to users)
- name (string)
- description (text)
- address (string)
- is_active (boolean)
- store_type (enum: 'convenience', 'restaurant')
- created_at, updated_at

---

### 3. ProductSeeder ✅
**Source**: `backend/app/Database/Seeds/ProductSeeder.php`
**Target**: `laravel-app/database/seeders/ProductSeeder.php`

**Data Structure**:
- ~50 products across all stores
- Mix of single and variable products
- Variable products have variants with attributes (Color, Size)

**Key Fields**:
- store_id (foreign key)
- category_id (foreign key)
- name (string)
- description (text)
- product_type (enum: 'single', 'variable')
- price (decimal, nullable for variable)
- image (string)
- stock (integer, nullable for variable)
- is_active (boolean)
- is_approved (boolean)
- featured (boolean)
- sales_count (integer)
- cuisine (string, nullable - for restaurants)
- ingredients (text, nullable - for restaurants)
- prep_time (integer, nullable - for restaurants)

**Related Tables**:
- attributes (Color, Size)
- attribute_values (Black, Blue, White, Small, Medium, Large)
- product_variants (for variable products)
- product_variant_attributes (pivot table)

---

### 4. AddOnsSeeder
**Source**: `backend/app/Database/Seeds/AddOnsSeeder.php`
**Target**: `laravel-app/database/seeders/AddOnSeeder.php`

**Data Structure**:
- Add-on categories (Drinks, Sides, Extras, Sauces)
- Add-ons per category
- Add-on variants (sizes, flavors)

---

### 5. SettingSeeder
**Source**: `backend/app/Database/Seeds/SettingSeeder.php`
**Target**: `laravel-app/database/seeders/SettingSeeder.php`

**Data Structure**:
- App settings (name, description, banners)
- Email settings
- Payment settings
- Shipping settings

---

### 6. RoleSeeder ✅ (Already exists)
**Status**: Already converted

---

### 7. UserSeeder ✅ (Already exists)
**Status**: Already converted

---

## Migration Steps

### For Each Seeder:

1. **Read the old CI seeder** carefully
2. **Check database structure** in migrations
3. **Create Laravel seeder** with exact same data
4. **Handle relationships** properly (foreign keys)
5. **Test the seeder** individually
6. **Update DatabaseSeeder** to call it in correct order

---

## Order of Execution

```php
// laravel-app/database/seeders/DatabaseSeeder.php
public function run()
{
    $this->call([
        RoleSeeder::class,           // 1. Roles first
        UserSeeder::class,           // 2. Users (need roles)
        CategorySeeder::class,       // 3. Categories (independent)
        StoreSeeder::class,          // 4. Stores (need users/clients)
        ProductSeeder::class,        // 5. Products (need stores & categories)
        AddOnSeeder::class,          // 6. Add-ons (need products)
        SettingSeeder::class,        // 7. Settings (independent)
        AchievementSeeder::class,    // 8. Achievements (independent)
        RiderStoreAssignmentSeeder::class, // 9. Assignments (need riders & stores)
    ]);
}
```

---

## Key Differences: CI vs Laravel

### CodeIgniter:
```php
$this->db->table('categories')->insert($data);
$parent_id = $this->db->insertID();
```

### Laravel:
```php
$category = Category::create($data);
$parent_id = $category->id;
// OR
DB::table('categories')->insert($data);
$parent_id = DB::getPdo()->lastInsertId();
```

---

## Testing Seeders

```bash
# Fresh migration + seed
php artisan migrate:fresh --seed

# Run specific seeder
php artisan db:seed --class=CategorySeeder

# Check data
php artisan tinker
>>> Category::count()
>>> Product::count()
>>> Store::count()
```

---

## Current Status

- [x] UserSeeder - Created
- [x] CategorySeeder - Created
- [x] StoreSeeder - Created
- [x] ProductSeeder - Created
- [x] AddOnSeeder - Created
- [x] SettingSeeder - Created

## Summary

All essential seeders have been successfully converted from CodeIgniter to Laravel:
- 6 users (1 admin, 4 clients, 1 customer)
- 72 categories (14 parent + 58 subcategories)
- 11 stores (3 convenience + 8 restaurants)
- 51 products (1 variable with 3 variants)
- 14 add-ons with 14 variants for Pizza Palace
- 8 application settings

---

## Next Steps

1. ✅ Create CategorySeeder
2. ✅ Create StoreSeeder
3. ✅ Create ProductSeeder
4. Create AddOnSeeder
5. Create SettingSeeder
6. Test all seeders together
7. Update DatabaseSeeder
