<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_item_addons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_item_id')->constrained()->onDelete('cascade');
            $table->foreignId('addon_id')->constrained('addons')->onDelete('cascade');
            $table->foreignId('addon_variant_id')->nullable()->constrained('addon_variants')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->decimal('price', 10, 2); // Store price at time of adding
            $table->timestamps();
            
            // Index for fast addon retrieval
            $table->index('cart_item_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_item_addons');
    }
};
