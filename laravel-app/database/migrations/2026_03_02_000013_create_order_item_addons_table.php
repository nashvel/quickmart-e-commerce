<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_item_addons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_item_id')->constrained()->onDelete('cascade');
            $table->foreignId('addon_id')->constrained('addons')->onDelete('restrict');
            $table->foreignId('addon_variant_id')->nullable()->constrained('addon_variants')->onDelete('restrict');
            $table->integer('quantity');
            $table->decimal('price', 10, 2); // Store price at time of order
            $table->timestamps();
            
            // Index for fast addon retrieval
            $table->index('order_item_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_item_addons');
    }
};
