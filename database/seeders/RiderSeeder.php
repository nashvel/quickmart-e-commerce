<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class RiderSeeder extends Seeder
{
    public function run(): void
    {
        $riders = [
            ['first_name' => 'Mark', 'last_name' => 'Rider', 'email' => 'rider1@example.com'],
            ['first_name' => 'Sarah', 'last_name' => 'Delivery', 'email' => 'rider2@example.com'],
            ['first_name' => 'Mike', 'last_name' => 'Express', 'email' => 'rider3@example.com'],
        ];

        foreach ($riders as $index => $rider) {
            User::create([
                'first_name' => $rider['first_name'],
                'last_name' => $rider['last_name'],
                'email' => $rider['email'],
                'phone' => '09' . str_pad(500 + $index, 9, '0', STR_PAD_LEFT),
                'password' => Hash::make('password'),
                'role' => 'rider',
                'is_verified' => true,
            ]);
        }

        $this->command->info('✅ Riders seeded');
    }
}
