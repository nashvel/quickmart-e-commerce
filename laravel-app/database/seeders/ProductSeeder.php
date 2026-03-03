<?php

namespace Database\Seeders;

use App\Models\Product\Product;
use App\Models\Product\ProductVariant;
use App\Models\Product\Category;
use App\Models\Store\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Truncate tables
        DB::table('cart_items')->truncate();
        DB::table('product_variants')->truncate();
        DB::table('products')->truncate();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Get store IDs
        $stores = Store::orderBy('id')->get();
        $store_ids = $stores->pluck('id')->toArray();

        // Get all categories and create a map
        $categories = Category::all();
        $category_map = [];
        foreach ($categories as $cat) {
            $category_map[$cat->name] = [
                'id' => $cat->id,
                'parent_id' => $cat->parent_id
            ];
        }

        $products = $this->getProductsData($store_ids);

        foreach ($products as $p) {
            $category_name = $p['category_name'];
            
            if (!isset($category_map[$category_name])) {
                $this->command->error("Category '{$category_name}' not found for product '{$p['name']}'");
                continue;
            }

            $category_id = $category_map[$category_name]['id'];

            // Create product
            $product = Product::create([
                'store_id' => $p['store_id'],
                'category_id' => $category_id,
                'name' => $p['name'],
                'description' => $p['description'],
                'product_type' => $p['product_type'] ?? 'single',
                'price' => $p['price'],
                'image' => $p['image'],
                'stock' => $p['stock'],
                'is_active' => true,
                'is_approved' => $p['is_approved'] ?? true,
            ]);

            // Create variants if product is variable
            if (($p['product_type'] ?? 'single') === 'variable' && isset($p['variants'])) {
                foreach ($p['variants'] as $variant_data) {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'sku' => $variant_data['sku'],
                        'name' => $this->generateVariantName($variant_data['attributes']),
                        'price' => $variant_data['price'],
                        'stock' => $variant_data['stock'],
                        'attributes' => json_encode($variant_data['attributes']),
                    ]);
                }
            }
        }

        $this->command->info('Products seeded successfully!');
        $this->command->info('Total products: ' . Product::count());
        $this->command->info('Total variants: ' . ProductVariant::count());
    }

    private function generateVariantName(array $attributes): string
    {
        return implode(' - ', array_values($attributes));
    }


    private function getProductsData(array $store_ids): array
    {
        return [
            // Tech World (Store 1) - Convenience Store
            [
                'store_id' => $store_ids[0],
                'category_name' => 'Computers & Accessories',
                'name' => 'Wireless Mouse',
                'description' => 'Ergonomic wireless mouse with multiple color options.',
                'price' => null,
                'image' => 'mouse.jpg',
                'stock' => null,
                'is_approved' => true,
                'product_type' => 'variable',
                'variants' => [
                    ['price' => 25.00, 'stock' => 50, 'sku' => 'WM-BLK', 'attributes' => ['Color' => 'Black', 'Size' => 'Medium']],
                    ['price' => 25.00, 'stock' => 35, 'sku' => 'WM-BLU', 'attributes' => ['Color' => 'Blue', 'Size' => 'Medium']],
                    ['price' => 22.00, 'stock' => 75, 'sku' => 'WM-WHT', 'attributes' => ['Color' => 'White', 'Size' => 'Medium']],
                ]
            ],
            [
                'store_id' => $store_ids[0],
                'category_name' => 'Computers & Accessories',
                'name' => 'Mechanical Keyboard',
                'description' => 'RGB mechanical keyboard.',
                'price' => 69.99,
                'image' => 'keyboard.jpg',
                'stock' => 120,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[0],
                'category_name' => 'Computers & Accessories',
                'name' => 'USB-C Hub',
                'description' => '7-in-1 USB-C hub.',
                'price' => 39.99,
                'image' => 'usbc_hub.jpg',
                'stock' => 200,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[0],
                'category_name' => 'Headphones',
                'name' => 'Noise Cancelling Headphones',
                'description' => 'Over-ear headphones.',
                'price' => 199.99,
                'image' => 'headphones.jpg',
                'stock' => 80,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[0],
                'category_name' => 'Cameras & Photography',
                'name' => '4K Webcam',
                'description' => 'Webcam with ring light.',
                'price' => 89.99,
                'image' => 'webcam.jpg',
                'stock' => 100,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[0],
                'category_name' => 'Computers & Accessories',
                'name' => 'Portable SSD',
                'description' => '1TB portable SSD.',
                'price' => 129.99,
                'image' => 'ssd.jpg',
                'stock' => 70,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[0],
                'category_name' => 'Computers & Accessories',
                'name' => 'Gaming Monitor',
                'description' => '27-inch 144Hz gaming monitor.',
                'price' => 299.99,
                'image' => 'monitor.jpg',
                'stock' => 50,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[0],
                'category_name' => 'Computers & Accessories',
                'name' => 'Laptop Stand',
                'description' => 'Adjustable aluminum laptop stand.',
                'price' => 29.99,
                'image' => 'laptop_stand.jpg',
                'stock' => 180,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[0],
                'category_name' => 'Fiction',
                'name' => 'The Great Gatsby',
                'description' => 'A classic novel.',
                'price' => 12.99,
                'image' => 'thegreatgatsby.jpg',
                'stock' => 250,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[0],
                'category_name' => 'Beverages',
                'name' => 'Energy Drink',
                'description' => 'A can of energy drink.',
                'price' => 2.99,
                'image' => 'energy_drink.jpg',
                'stock' => 500,
                'is_approved' => true,
                'product_type' => 'single'
            ],

            // Fashion Hub (Store 2) - Convenience Store
            [
                'store_id' => $store_ids[1],
                'category_name' => 'Females Wear',
                'name' => 'Summer Dress',
                'description' => 'Light and airy summer dress.',
                'price' => 39.99,
                'image' => 'summer_dress.jpg',
                'stock' => 120,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[1],
                'category_name' => 'Mens Wear',
                'name' => 'Leather Jacket',
                'description' => 'Classic leather jacket.',
                'price' => 149.99,
                'image' => 'leather_jacket.jpg',
                'stock' => 60,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[1],
                'category_name' => 'Mens Wear',
                'name' => 'Skinny Jeans',
                'description' => 'Comfortable skinny jeans.',
                'price' => 59.99,
                'image' => 'jeans.jpg',
                'stock' => 200,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[1],
                'category_name' => 'Mens Wear',
                'name' => 'T-Shirt',
                'description' => 'Plain white t-shirt.',
                'price' => 19.99,
                'image' => 'tshirt.jpg',
                'stock' => 300,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[1],
                'category_name' => 'Shoes',
                'name' => 'Sneakers',
                'description' => 'Stylish sneakers.',
                'price' => 79.99,
                'image' => 'sneakers.jpg',
                'stock' => 150,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[1],
                'category_name' => 'Glasses',
                'name' => 'Sunglasses',
                'description' => 'UV protection sunglasses.',
                'price' => 24.99,
                'image' => 'sunglasses.jpg',
                'stock' => 180,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[1],
                'category_name' => 'Bags',
                'name' => 'Watch',
                'description' => 'Minimalist wrist watch.',
                'price' => 99.99,
                'image' => 'watch.jpg',
                'stock' => 90,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[1],
                'category_name' => 'Mens Wear',
                'name' => 'Beanie',
                'description' => 'Warm winter beanie.',
                'price' => 14.99,
                'image' => 'beanie.jpg',
                'stock' => 220,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[1],
                'category_name' => 'Bags',
                'name' => 'Umbrella',
                'description' => 'Windproof umbrella.',
                'price' => 29.99,
                'image' => 'umbrella.jpg',
                'stock' => 130,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[1],
                'category_name' => 'Team Sports',
                'name' => 'Basketball',
                'description' => 'Official size basketball.',
                'price' => 24.99,
                'image' => 'basketball.jpg',
                'stock' => 100,
                'is_approved' => true,
                'product_type' => 'single'
            ],

            // Home Essentials (Store 3) - Convenience Store
            [
                'store_id' => $store_ids[2],
                'category_name' => 'Bed & Bath',
                'name' => 'Pillow',
                'description' => 'Memory foam pillow.',
                'price' => 19.99,
                'image' => 'pillow.jpg',
                'stock' => 200,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[2],
                'category_name' => 'Home Decor',
                'name' => 'Scented Candles',
                'description' => 'Set of 3 scented candles.',
                'price' => 24.99,
                'image' => 'candles.jpg',
                'stock' => 250,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[2],
                'category_name' => 'Kitchen & Dining',
                'name' => 'Coffee Maker',
                'description' => '12-cup coffee maker.',
                'price' => 49.99,
                'image' => 'coffee_maker.jpg',
                'stock' => 80,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[2],
                'category_name' => 'Bed & Bath',
                'name' => 'Towel Set',
                'description' => '6-piece towel set.',
                'price' => 34.99,
                'image' => 'towel_set.jpg',
                'stock' => 150,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[2],
                'category_name' => 'Kitchen & Dining',
                'name' => 'Cookware Set',
                'description' => '10-piece non-stick cookware set.',
                'price' => 89.99,
                'image' => 'cookware.jpg',
                'stock' => 60,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[2],
                'category_name' => 'Home Decor',
                'name' => 'Picture Frame',
                'description' => '8x10 picture frame.',
                'price' => 9.99,
                'image' => 'picture_frame.jpg',
                'stock' => 300,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[2],
                'category_name' => 'Home Decor',
                'name' => 'Wall Clock',
                'description' => 'Modern wall clock.',
                'price' => 19.99,
                'image' => 'wall_clock.jpg',
                'stock' => 120,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[2],
                'category_name' => 'Home Decor',
                'name' => 'Desk Lamp',
                'description' => 'LED desk lamp.',
                'price' => 29.99,
                'image' => 'desk_lamp.jpg',
                'stock' => 140,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[2],
                'category_name' => 'Home Decor',
                'name' => 'Throw Blanket',
                'description' => 'Cozy throw blanket.',
                'price' => 24.99,
                'image' => 'blanket.jpg',
                'stock' => 180,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[2],
                'category_name' => 'Snacks',
                'name' => 'Instant Noodles',
                'description' => 'Pack of 5 instant noodles.',
                'price' => 4.99,
                'image' => 'noodles.jpg',
                'stock' => 500,
                'is_approved' => true,
                'product_type' => 'single'
            ],

            // Pizza Palace (Store 4) - Restaurant
            [
                'store_id' => $store_ids[3],
                'category_name' => 'Margherita',
                'name' => 'Margherita Pizza',
                'description' => 'Classic pizza with tomatoes, mozzarella, and basil.',
                'price' => 15.99,
                'image' => 'margherita.jpg',
                'stock' => 50,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[3],
                'category_name' => 'Pepperoni',
                'name' => 'Pepperoni Pizza',
                'description' => 'Pizza with pepperoni and cheese.',
                'price' => 17.99,
                'image' => 'pepperoni.jpg',
                'stock' => 40,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[3],
                'category_name' => 'Supreme',
                'name' => 'Supreme Pizza',
                'description' => 'Pizza loaded with pepperoni, sausage, peppers, and mushrooms.',
                'price' => 19.99,
                'image' => 'supreme.jpg',
                'stock' => 30,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[3],
                'category_name' => 'Vegetarian',
                'name' => 'Veggie Pizza',
                'description' => 'Fresh vegetables on a crispy crust.',
                'price' => 16.99,
                'image' => 'veggie.jpg',
                'stock' => 35,
                'is_approved' => true,
                'product_type' => 'single'
            ],

            // Burger Junction (Store 5) - Restaurant
            [
                'store_id' => $store_ids[4],
                'category_name' => 'Beef Burgers',
                'name' => 'Classic Beef Burger',
                'description' => 'Juicy beef patty with lettuce, tomato, and cheese.',
                'price' => 12.99,
                'image' => 'beef_burger.jpg',
                'stock' => 60,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[4],
                'category_name' => 'Chicken Burgers',
                'name' => 'Crispy Chicken Burger',
                'description' => 'Crispy fried chicken with mayo and pickles.',
                'price' => 11.99,
                'image' => 'chicken_burger.jpg',
                'stock' => 45,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[4],
                'category_name' => 'Veggie Burgers',
                'name' => 'Plant-Based Burger',
                'description' => 'Delicious plant-based patty with fresh toppings.',
                'price' => 13.99,
                'image' => 'veggie_burger.jpg',
                'stock' => 40,
                'is_approved' => true,
                'product_type' => 'single'
            ],

            // Asian Fusion (Store 6) - Restaurant
            [
                'store_id' => $store_ids[5],
                'category_name' => 'Chinese',
                'name' => 'Kung Pao Chicken',
                'description' => 'Spicy stir-fried chicken with peanuts and vegetables.',
                'price' => 14.99,
                'image' => 'kung_pao.jpg',
                'stock' => 50,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[5],
                'category_name' => 'Japanese',
                'name' => 'Chicken Teriyaki Bowl',
                'description' => 'Grilled chicken with teriyaki sauce over rice.',
                'price' => 13.99,
                'image' => 'teriyaki.jpg',
                'stock' => 55,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[5],
                'category_name' => 'Thai',
                'name' => 'Pad Thai',
                'description' => 'Traditional Thai stir-fried noodles with shrimp.',
                'price' => 15.99,
                'image' => 'pad_thai.jpg',
                'stock' => 40,
                'is_approved' => true,
                'product_type' => 'single'
            ],

            // Healthy Bites (Store 7) - Restaurant
            [
                'store_id' => $store_ids[6],
                'category_name' => 'Salads',
                'name' => 'Caesar Salad',
                'description' => 'Fresh romaine lettuce with caesar dressing and croutons.',
                'price' => 9.99,
                'image' => 'caesar_salad.jpg',
                'stock' => 70,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[6],
                'category_name' => 'Smoothies',
                'name' => 'Green Power Smoothie',
                'description' => 'Spinach, banana, and mango smoothie packed with nutrients.',
                'price' => 7.99,
                'image' => 'green_smoothie.jpg',
                'stock' => 80,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[6],
                'category_name' => 'Grain Bowls',
                'name' => 'Quinoa Power Bowl',
                'description' => 'Quinoa bowl with roasted vegetables and tahini dressing.',
                'price' => 12.99,
                'image' => 'quinoa_bowl.jpg',
                'stock' => 45,
                'is_approved' => true,
                'product_type' => 'single'
            ],

            // Sweet Treats (Store 8) - Restaurant
            [
                'store_id' => $store_ids[7],
                'category_name' => 'Cakes',
                'name' => 'Chocolate Fudge Cake',
                'description' => 'Rich chocolate cake with fudge frosting.',
                'price' => 4.99,
                'image' => 'chocolate_cake.jpg',
                'stock' => 25,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[7],
                'category_name' => 'Ice Cream',
                'name' => 'Vanilla Bean Ice Cream',
                'description' => 'Creamy vanilla ice cream made with real vanilla beans.',
                'price' => 3.99,
                'image' => 'vanilla_ice_cream.jpg',
                'stock' => 100,
                'is_approved' => true,
                'product_type' => 'single'
            ],

            // Coffee Corner (Store 9) - Restaurant
            [
                'store_id' => $store_ids[8],
                'category_name' => 'Espresso',
                'name' => 'Double Espresso',
                'description' => 'Rich and bold double shot of espresso.',
                'price' => 3.99,
                'image' => 'espresso.jpg',
                'stock' => 200,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[8],
                'category_name' => 'Latte',
                'name' => 'Caramel Latte',
                'description' => 'Smooth latte with caramel syrup and steamed milk.',
                'price' => 5.99,
                'image' => 'caramel_latte.jpg',
                'stock' => 150,
                'is_approved' => true,
                'product_type' => 'single'
            ],

            // Quick Bites (Store 10) - Restaurant
            [
                'store_id' => $store_ids[9],
                'category_name' => 'Fried Chicken',
                'name' => 'Crispy Fried Chicken',
                'description' => 'Golden crispy fried chicken pieces.',
                'price' => 8.99,
                'image' => 'fried_chicken.jpg',
                'stock' => 80,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[9],
                'category_name' => 'Hot Dogs',
                'name' => 'Classic Hot Dog',
                'description' => 'All-beef hot dog with mustard and ketchup.',
                'price' => 4.99,
                'image' => 'hot_dog.jpg',
                'stock' => 120,
                'is_approved' => true,
                'product_type' => 'single'
            ],

            // Ocean Delights (Store 11) - Restaurant
            [
                'store_id' => $store_ids[10],
                'category_name' => 'Grilled Fish',
                'name' => 'Grilled Salmon',
                'description' => 'Fresh Atlantic salmon grilled to perfection.',
                'price' => 18.99,
                'image' => 'grilled_salmon.jpg',
                'stock' => 30,
                'is_approved' => true,
                'product_type' => 'single'
            ],
            [
                'store_id' => $store_ids[10],
                'category_name' => 'Shrimp',
                'name' => 'Garlic Butter Shrimp',
                'description' => 'Succulent shrimp sautéed in garlic butter.',
                'price' => 16.99,
                'image' => 'garlic_shrimp.jpg',
                'stock' => 40,
                'is_approved' => true,
                'product_type' => 'single'
            ],
        ];
    }
}
