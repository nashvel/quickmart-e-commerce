<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Store\Store;
use App\Models\Product\Category;
use App\Models\Product\Product;
use App\Models\Product\ProductVariant;
use App\Models\AddOn\AddOnCategory;
use App\Models\AddOn\AddOn;
use App\Models\Address\Address;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // Create Categories
        $electronics = Category::create(['name' => 'Electronics', 'icon' => '📱']);
        $food = Category::create(['name' => 'Food & Beverages', 'icon' => '🍔']);
        $clothing = Category::create(['name' => 'Clothing', 'icon' => '👕']);
        
        // Create Users
        $customer = User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'customer@example.com',
            'phone' => '1234567890',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'is_verified' => true,
        ]);

        $client = User::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'seller@example.com',
            'phone' => '0987654321',
            'password' => Hash::make('password'),
            'role' => 'client',
            'is_verified' => true,
        ]);

        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'phone' => '1112223333',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_verified' => true,
        ]);

        // Create Address for customer
        Address::create([
            'user_id' => $customer->id,
            'full_name' => 'John Doe',
            'phone' => '1234567890',
            'line1' => '123 Main Street',
            'city' => 'Manila',
            'province' => 'Metro Manila',
            'zip_code' => '1000',
            'is_default' => true,
        ]);

        // Create Store
        $store = Store::create([
            'client_id' => $client->id,
            'name' => 'QuickMart Store',
            'description' => 'Your one-stop shop for everything',
            'address' => '456 Commerce Ave, Manila',
            'phone_number' => '0987654321',
            'delivery_fee' => 50.00,
            'store_type' => 'convenience',
            'is_active' => true,
        ]);

        // Create Products
        $products = [
            [
                'name' => 'Smartphone X',
                'description' => 'Latest smartphone with amazing features',
                'price' => 15999.00,
                'stock' => 50,
                'category_id' => $electronics->id,
            ],
            [
                'name' => 'Wireless Headphones',
                'description' => 'Premium sound quality headphones',
                'price' => 2999.00,
                'stock' => 100,
                'category_id' => $electronics->id,
            ],
            [
                'name' => 'Burger Meal',
                'description' => 'Delicious burger with fries and drink',
                'price' => 199.00,
                'stock' => 999,
                'category_id' => $food->id,
            ],
            [
                'name' => 'Pizza Large',
                'description' => 'Large pizza with your choice of toppings',
                'price' => 399.00,
                'stock' => 999,
                'category_id' => $food->id,
            ],
            [
                'name' => 'T-Shirt',
                'description' => 'Comfortable cotton t-shirt',
                'price' => 299.00,
                'stock' => 200,
                'category_id' => $clothing->id,
            ],
        ];

        foreach ($products as $productData) {
            Product::create([
                'store_id' => $store->id,
                'category_id' => $productData['category_id'],
                'name' => $productData['name'],
                'description' => $productData['description'],
                'price' => $productData['price'],
                'stock' => $productData['stock'],
                'is_active' => true,
                'is_approved' => true,
            ]);
        }

        // Create Add-on Category
        $toppings = AddOnCategory::create([
            'name' => 'Pizza Toppings',
            'description' => 'Extra toppings for your pizza',
        ]);

        // Create Add-ons
        AddOn::create([
            'store_id' => $store->id,
            'category_id' => $toppings->id,
            'name' => 'Extra Cheese',
            'price' => 50.00,
            'is_active' => true,
        ]);

        AddOn::create([
            'store_id' => $store->id,
            'category_id' => $toppings->id,
            'name' => 'Pepperoni',
            'price' => 75.00,
            'is_active' => true,
        ]);

        $this->command->info('✅ Demo data seeded successfully!');
        $this->command->info('');
        $this->command->info('Login Credentials:');
        $this->command->info('Customer: customer@example.com / password');
        $this->command->info('Seller: seller@example.com / password');
        $this->command->info('Admin: admin@example.com / password');
    }
}
