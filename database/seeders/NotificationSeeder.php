<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get a customer user
        $customer = User::where('role', 'customer')->first();
        
        if (!$customer) {
            $this->command->warn('No customer user found. Skipping notification seeder.');
            return;
        }

        $notifications = [
            [
                'user_id' => $customer->id,
                'type' => 'order',
                'title' => 'Order Confirmed',
                'message' => 'Your order #1001 has been confirmed and is being prepared.',
                'link' => '/orders/1',
                'is_read' => false,
                'created_at' => now()->subHours(2),
            ],
            [
                'user_id' => $customer->id,
                'type' => 'order',
                'title' => 'Order Shipped',
                'message' => 'Your order #1002 has been shipped and is on the way!',
                'link' => '/track-order/2',
                'is_read' => false,
                'created_at' => now()->subHours(5),
            ],
            [
                'user_id' => $customer->id,
                'type' => 'promotion',
                'title' => '50% Off Electronics',
                'message' => 'Get 50% off on all electronics! Limited time offer.',
                'link' => '/products?category=Electronics',
                'is_read' => false,
                'created_at' => now()->subDay(),
            ],
            [
                'user_id' => $customer->id,
                'type' => 'message',
                'title' => 'New Message',
                'message' => 'Tech World replied to your inquiry about the Wireless Mouse.',
                'link' => '/chat',
                'is_read' => true,
                'read_at' => now()->subHours(3),
                'created_at' => now()->subHours(4),
            ],
            [
                'user_id' => $customer->id,
                'type' => 'system',
                'title' => 'Welcome to QuickMart!',
                'message' => 'Thank you for joining QuickMart. Start shopping now!',
                'link' => '/products',
                'is_read' => true,
                'read_at' => now()->subDays(2),
                'created_at' => now()->subDays(3),
            ],
        ];

        foreach ($notifications as $notification) {
            Notification::create($notification);
        }

        $this->command->info('✅ Notifications seeded successfully!');
        $this->command->info('   - Total notifications: ' . count($notifications));
        $this->command->info('   - Unread: ' . collect($notifications)->where('is_read', false)->count());
    }
}
