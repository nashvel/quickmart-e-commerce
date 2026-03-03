<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\AddOn\AddOn;
use App\Models\AddOn\AddOnCategory;
use App\Models\AddOn\AddOnVariant;
use App\Models\Store\Store;

class AddOnSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Converted from CodeIgniter: backend/app/Database/Seeds/AddOnsSeeder.php
     * Creates add-on categories, add-ons, and variants for Pizza Palace
     */
    public function run(): void
    {
        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Truncate tables
        DB::table('addon_variants')->truncate();
        DB::table('addons')->truncate();
        DB::table('addon_categories')->truncate();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Get Pizza Palace store
        $store = Store::where('name', 'Pizza Palace')->first();
        
        if (!$store) {
            $this->command->error('❌ Pizza Palace store not found. Please run StoreSeeder first.');
            return;
        }

        $store_id = $store->id;

        // Create addon categories
        $categories = [
            [
                'name' => 'Beverages',
                'description' => 'Refreshing drinks to complement your meal',
            ],
            [
                'name' => 'Sides',
                'description' => 'Delicious sides to complete your order',
            ],
            [
                'name' => 'Desserts',
                'description' => 'Sweet treats to end your meal',
            ],
            [
                'name' => 'Extras',
                'description' => 'Additional toppings and extras',
            ],
        ];

        foreach ($categories as $category) {
            AddOnCategory::create($category);
        }

        // Get category IDs
        $beverages_cat = AddOnCategory::where('name', 'Beverages')->first();
        $sides_cat = AddOnCategory::where('name', 'Sides')->first();
        $desserts_cat = AddOnCategory::where('name', 'Desserts')->first();
        $extras_cat = AddOnCategory::where('name', 'Extras')->first();

        // Create addons
        $addons = [
            // Beverages
            [
                'store_id' => $store_id,
                'category_id' => $beverages_cat->id,
                'name' => 'Coca Cola',
                'price' => 45.00,
                'image' => 'coca-cola.jpg',
                'is_active' => true,
                'variants' => [
                    ['name' => 'Small (12oz)', 'price' => 45.00],
                    ['name' => 'Medium (16oz)', 'price' => 50.00],
                    ['name' => 'Large (20oz)', 'price' => 60.00],
                ]
            ],
            [
                'store_id' => $store_id,
                'category_id' => $beverages_cat->id,
                'name' => 'Pepsi',
                'price' => 45.00,
                'image' => 'pepsi.jpg',
                'is_active' => true,
                'variants' => [
                    ['name' => 'Small (12oz)', 'price' => 45.00],
                    ['name' => 'Medium (16oz)', 'price' => 50.00],
                    ['name' => 'Large (20oz)', 'price' => 60.00],
                ]
            ],
            [
                'store_id' => $store_id,
                'category_id' => $beverages_cat->id,
                'name' => 'Orange Juice',
                'price' => 65.00,
                'image' => 'orange-juice.jpg',
                'is_active' => true,
                'variants' => [
                    ['name' => 'Regular (12oz)', 'price' => 65.00],
                    ['name' => 'Large (16oz)', 'price' => 75.00],
                ]
            ],
            [
                'store_id' => $store_id,
                'category_id' => $beverages_cat->id,
                'name' => 'Iced Tea',
                'price' => 40.00,
                'image' => 'iced-tea.jpg',
                'is_active' => true,
                'variants' => [
                    ['name' => 'Regular (16oz)', 'price' => 40.00],
                    ['name' => 'Sweet Tea', 'price' => 45.00],
                ]
            ],
            
            // Sides
            [
                'store_id' => $store_id,
                'category_id' => $sides_cat->id,
                'name' => 'Garlic Bread',
                'price' => 85.00,
                'image' => 'garlic-bread.jpg',
                'is_active' => true,
            ],
            [
                'store_id' => $store_id,
                'category_id' => $sides_cat->id,
                'name' => 'Buffalo Wings',
                'price' => 180.00,
                'image' => 'buffalo-wings.jpg',
                'is_active' => true,
                'variants' => [
                    ['name' => '6 pieces', 'price' => 180.00],
                    ['name' => '12 pieces', 'price' => 320.00],
                    ['name' => 'Mild', 'price' => 180.00],
                    ['name' => 'Hot', 'price' => 180.00],
                ]
            ],
            [
                'store_id' => $store_id,
                'category_id' => $sides_cat->id,
                'name' => 'Mozzarella Sticks',
                'price' => 140.00,
                'image' => 'mozzarella-sticks.jpg',
                'is_active' => true,
            ],
            [
                'store_id' => $store_id,
                'category_id' => $sides_cat->id,
                'name' => 'Caesar Salad',
                'price' => 120.00,
                'image' => 'caesar-salad.jpg',
                'is_active' => true,
            ],
            
            // Desserts
            [
                'store_id' => $store_id,
                'category_id' => $desserts_cat->id,
                'name' => 'Chocolate Brownie',
                'price' => 95.00,
                'image' => 'chocolate-brownie.jpg',
                'is_active' => true,
            ],
            [
                'store_id' => $store_id,
                'category_id' => $desserts_cat->id,
                'name' => 'Tiramisu',
                'price' => 110.00,
                'image' => 'tiramisu.jpg',
                'is_active' => true,
            ],
            [
                'store_id' => $store_id,
                'category_id' => $desserts_cat->id,
                'name' => 'Cheesecake',
                'price' => 95.00,
                'image' => 'cheesecake.jpg',
                'is_active' => true,
            ],
            
            // Extras
            [
                'store_id' => $store_id,
                'category_id' => $extras_cat->id,
                'name' => 'Extra Cheese',
                'price' => 35.00,
                'image' => 'extra-cheese.jpg',
                'is_active' => true,
            ],
            [
                'store_id' => $store_id,
                'category_id' => $extras_cat->id,
                'name' => 'Pepperoni',
                'price' => 45.00,
                'image' => 'pepperoni.jpg',
                'is_active' => true,
            ],
            [
                'store_id' => $store_id,
                'category_id' => $extras_cat->id,
                'name' => 'Mushrooms',
                'price' => 30.00,
                'image' => 'mushrooms.jpg',
                'is_active' => true,
            ],
        ];

        foreach ($addons as $addonData) {
            $variants = $addonData['variants'] ?? null;
            unset($addonData['variants']);

            // Create addon
            $addon = AddOn::create($addonData);

            // Create variants if they exist
            if ($variants) {
                foreach ($variants as $variantData) {
                    AddOnVariant::create([
                        'addon_id' => $addon->id,
                        'name' => $variantData['name'],
                        'price' => $variantData['price'],
                    ]);
                }
            }
        }

        $this->command->info('✅ Add-ons seeded successfully for Pizza Palace!');
        $this->command->info('   - Categories: ' . AddOnCategory::count());
        $this->command->info('   - Add-ons: ' . AddOn::count());
        $this->command->info('   - Variants: ' . AddOnVariant::count());
    }
}
