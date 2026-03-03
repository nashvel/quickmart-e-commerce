<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('session_id')->nullable(); // For guest carts
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->timestamps();
            
            // Composite indexes for fast cart retrieval
            $table->index(['user_id', 'created_at']);
            $table->index(['session_id', 'created_at']);
            
            // Unique constraints to prevent duplicate items
            $table->unique(['user_id', 'product_id', 'variant_id'], 'user_cart_unique');
            $table->unique(['session_id', 'product_id', 'variant_id'], 'session_cart_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
