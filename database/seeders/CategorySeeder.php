<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Product\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Converted from CodeIgniter: backend/app/Database/Seeds/CategorySeeder.php
     * Creates 14 parent categories with their subcategories
     */
    public function run(): void
    {
        // Disable foreign key checks for clean seeding
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('categories')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $categories = [
            ['name' => 'Electronics', 'icon' => 'fas fa-laptop', 'sub_categories' => [
                ['name' => 'Computers & Accessories'], 
                ['name' => 'Headphones'], 
                ['name' => 'Cameras & Photography'], 
                ['name' => 'Smartphones & Tablets']
            ]],
            ['name' => 'Fashion', 'icon' => 'fas fa-tshirt', 'sub_categories' => [
                ['name' => "Females Wear"], 
                ['name' => "Mens Wear"], 
                ['name' => "Childrens Wear"], 
                ['name' => 'Shoes'], 
                ['name' => 'Bags'], 
                ['name' => 'Glasses']
            ]],
            ['name' => 'Home & Kitchen', 'icon' => 'fas fa-home', 'sub_categories' => [
                ['name' => 'Kitchen & Dining'], 
                ['name' => 'Furniture'], 
                ['name' => 'Home Decor'], 
                ['name' => 'Bed & Bath']
            ]],
            ['name' => 'Books', 'icon' => 'fas fa-book', 'sub_categories' => [
                ['name' => 'Fiction'], 
                ['name' => 'Non-Fiction'], 
                ['name' => 'Science & Technology'], 
                ['name' => 'Comics']
            ]],
            ['name' => 'Sports & Outdoors', 'icon' => 'fas fa-futbol', 'sub_categories' => [
                ['name' => 'Team Sports'], 
                ['name' => 'Exercise & Fitness'], 
                ['name' => 'Outdoor Recreation'], 
                ['name' => 'Sports Apparel']
            ]],
            ['name' => 'Food & Grocery', 'icon' => 'fas fa-utensils', 'sub_categories' => [
                ['name' => 'Fresh Produce'], 
                ['name' => 'Beverages'], 
                ['name' => 'Snacks'], 
                ['name' => 'Dairy & Chilled']
            ]],
            // Restaurant Food Categories
            ['name' => 'Pizza', 'icon' => 'fas fa-pizza-slice', 'sub_categories' => [
                ['name' => 'Margherita'], 
                ['name' => 'Pepperoni'], 
                ['name' => 'Supreme'], 
                ['name' => 'Vegetarian']
            ]],
            ['name' => 'Burgers', 'icon' => 'fas fa-hamburger', 'sub_categories' => [
                ['name' => 'Beef Burgers'], 
                ['name' => 'Chicken Burgers'], 
                ['name' => 'Veggie Burgers'], 
                ['name' => 'Fish Burgers']
            ]],
            ['name' => 'Asian', 'icon' => 'fas fa-bowl-rice', 'sub_categories' => [
                ['name' => 'Chinese'], 
                ['name' => 'Japanese'], 
                ['name' => 'Thai'], 
                ['name' => 'Korean']
            ]],
            ['name' => 'Healthy', 'icon' => 'fas fa-leaf', 'sub_categories' => [
                ['name' => 'Salads'], 
                ['name' => 'Smoothies'], 
                ['name' => 'Grain Bowls'], 
                ['name' => 'Wraps']
            ]],
            ['name' => 'Desserts', 'icon' => 'fas fa-ice-cream', 'sub_categories' => [
                ['name' => 'Cakes'], 
                ['name' => 'Ice Cream'], 
                ['name' => 'Pastries'], 
                ['name' => 'Cookies']
            ]],
            ['name' => 'Coffee', 'icon' => 'fas fa-coffee', 'sub_categories' => [
                ['name' => 'Espresso'], 
                ['name' => 'Latte'], 
                ['name' => 'Cappuccino'], 
                ['name' => 'Cold Brew']
            ]],
            ['name' => 'Fast Food', 'icon' => 'fas fa-hotdog', 'sub_categories' => [
                ['name' => 'Fried Chicken'], 
                ['name' => 'Hot Dogs'], 
                ['name' => 'Tacos'], 
                ['name' => 'Sandwiches']
            ]],
            ['name' => 'Seafood', 'icon' => 'fas fa-fish', 'sub_categories' => [
                ['name' => 'Grilled Fish'], 
                ['name' => 'Shrimp'], 
                ['name' => 'Crab'], 
                ['name' => 'Sushi']
            ]]
        ];

        foreach ($categories as $category) {
            // Create parent category
            $parent = Category::create([
                'name' => $category['name'],
                'icon' => $category['icon'],
                'parent_id' => null,
            ]);

            // Create subcategories
            foreach ($category['sub_categories'] as $sub_category) {
                Category::create([
                    'name' => $sub_category['name'],
                    'icon' => null,
                    'parent_id' => $parent->id,
                ]);
            }
        }

        $this->command->info('✅ Categories seeded successfully!');
        $this->command->info('   - Parent categories: 14');
        $this->command->info('   - Total categories: ' . Category::count());
    }
}
