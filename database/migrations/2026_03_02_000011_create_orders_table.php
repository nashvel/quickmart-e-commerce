<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('store_id')->constrained()->onDelete('restrict');
            $table->foreignId('rider_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('delivery_address_id')->constrained('addresses')->onDelete('restrict');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('delivery_fee', 8, 2)->default(0);
            $table->enum('status', ['pending', 'accepted', 'rejected', 'in_transit', 'delivered', 'cancelled'])->index();
            $table->string('payment_method', 50);
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Composite indexes for common queries
            $table->index(['customer_id', 'status', 'created_at']); // Customer order history
            $table->index(['store_id', 'status', 'created_at']); // Store orders
            $table->index(['rider_id', 'status']); // Rider orders
            $table->index(['status', 'created_at']); // Admin order management
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
