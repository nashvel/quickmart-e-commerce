<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('sku', 100)->unique()->index(); // Indexed for fast SKU lookups
            $table->string('name', 150);
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0);
            $table->json('attributes')->nullable(); // Size, color, etc.
            $table->timestamps();
            
            // Composite index for product variants listing
            $table->index(['product_id', 'stock']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
