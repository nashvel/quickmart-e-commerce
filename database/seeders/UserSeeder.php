<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'phone' => '1112223333',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_verified' => true,
        ]);

        // Create client users (store owners)
        $clients = [
            ['first_name' => 'Tech', 'last_name' => 'Owner', 'email' => 'tech@example.com'],
            ['first_name' => 'Fashion', 'last_name' => 'Owner', 'email' => 'fashion@example.com'],
            ['first_name' => 'Home', 'last_name' => 'Owner', 'email' => 'home@example.com'],
            ['first_name' => 'Pizza', 'last_name' => 'Owner', 'email' => 'pizza@example.com'],
        ];

        foreach ($clients as $index => $client) {
            User::create([
                'first_name' => $client['first_name'],
                'last_name' => $client['last_name'],
                'email' => $client['email'],
                'phone' => '09' . str_pad($index + 1, 9, '0', STR_PAD_LEFT),
                'password' => Hash::make('password'),
                'role' => 'client',
                'is_verified' => true,
            ]);
        }

        // Create customer user
        User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'customer@example.com',
            'phone' => '09123456789',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'is_verified' => true,
        ]);

        $this->command->info('✅ Users seeded successfully!');
        $this->command->info('   - Admin: 1');
        $this->command->info('   - Clients: 4');
        $this->command->info('   - Customers: 1');
    }
}
