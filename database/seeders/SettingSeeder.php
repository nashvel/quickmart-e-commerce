<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Converted from CodeIgniter: backend/app/Database/Seeds/SettingSeeder.php
     * Creates application settings
     */
    public function run(): void
    {
        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('settings')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $settings = [
            ['key' => 'app_name', 'value' => 'Ecomxpert'],
            ['key' => 'app_description', 'value' => "Quick and Easy Shopping at Your Fingertips\nOrder your favorite convenience store items with just a few clicks"],
            ['key' => 'facebook_url', 'value' => ''],
            ['key' => 'twitter_url', 'value' => ''],
            ['key' => 'instagram_url', 'value' => ''],
            ['key' => 'api_logging', 'value' => 'true'],
            ['key' => 'restaurant_banner_text', 'value' => 'Explore our Restaurants with a delivery at your fingertips'],
            ['key' => 'main_banner_text', 'value' => 'Your Everyday Essentials, Delivered.'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }

        $this->command->info('✅ Settings seeded successfully!');
        $this->command->info('   - Total settings: ' . Setting::count());
    }
}
