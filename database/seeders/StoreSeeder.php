<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Store\Store;
use App\Models\User;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Converted from CodeIgniter: backend/app/Database/Seeds/StoreSeeder.php
     * Creates 11 stores (3 convenience + 8 restaurants)
     */
    public function run(): void
    {
        // Disable foreign key checks for clean seeding
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('stores')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Get client users (role = 'client')
        $clients = User::where('role', 'client')
            ->orderBy('id', 'ASC')
            ->get();

        if ($clients->count() < 4) {
            $this->command->error('❌ Not enough client users found. Please run UserSeeder first.');
            return;
        }

        $client_ids = $clients->pluck('id')->toArray();

        $stores = [
            [
                'client_id' => $client_ids[0],
                'name' => 'Tech World',
                'description' => 'Your one-stop shop for all things tech.',
                'address' => '123 Tech Street, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'convenience',
            ],
            [
                'client_id' => $client_ids[1],
                'name' => 'Fashion Forward',
                'description' => 'The latest trends in fashion.',
                'address' => '456 Fashion Ave, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'convenience',
            ],
            [
                'client_id' => $client_ids[2],
                'name' => 'Home Essentials',
                'description' => 'Everything you need for your home.',
                'address' => '789 Home Blvd, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'convenience',
            ],
            [
                'client_id' => $client_ids[3],
                'name' => 'Pizza Palace',
                'description' => 'Delicious pizzas made fresh.',
                'address' => '101 Pizza Lane, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
            ],
            // Additional Restaurant Stores
            [
                'client_id' => $client_ids[0], // Reusing client IDs for demo
                'name' => 'Burger Junction',
                'description' => 'Gourmet burgers and fries.',
                'address' => '202 Burger Street, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
            ],
            [
                'client_id' => $client_ids[1],
                'name' => 'Asian Fusion',
                'description' => 'Authentic Asian cuisine with a modern twist.',
                'address' => '303 Asia Avenue, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
            ],
            [
                'client_id' => $client_ids[2],
                'name' => 'Healthy Bites',
                'description' => 'Fresh salads, smoothies, and healthy meals.',
                'address' => '404 Health Way, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
            ],
            [
                'client_id' => $client_ids[3],
                'name' => 'Sweet Treats',
                'description' => 'Cakes, pastries, and desserts.',
                'address' => '505 Dessert Drive, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
            ],
            [
                'client_id' => $client_ids[0],
                'name' => 'Coffee Corner',
                'description' => 'Premium coffee and light snacks.',
                'address' => '606 Coffee Court, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
            ],
            [
                'client_id' => $client_ids[1],
                'name' => 'Quick Bites',
                'description' => 'Fast food favorites and quick meals.',
                'address' => '707 Fast Lane, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
            ],
            [
                'client_id' => $client_ids[2],
                'name' => 'Ocean Delights',
                'description' => 'Fresh seafood and marine cuisine.',
                'address' => '808 Seafood Street, Tagoloan, Misamis Oriental',
                'is_active' => true,
                'store_type' => 'restaurant',
            ],
        ];

        foreach ($stores as $store) {
            Store::create($store);
        }

        $convenience_count = Store::where('store_type', 'convenience')->count();
        $restaurant_count = Store::where('store_type', 'restaurant')->count();

        $this->command->info('✅ Stores seeded successfully!');
        $this->command->info('   - Convenience stores: ' . $convenience_count);
        $this->command->info('   - Restaurants: ' . $restaurant_count);
        $this->command->info('   - Total stores: ' . Store::count());
    }
}
