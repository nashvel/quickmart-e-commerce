<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            $table->string('name', 200)->index(); // Indexed for search
            $table->text('description');
            $table->decimal('price', 10, 2)->nullable()->index(); // Indexed for price sorting, nullable for variable products
            $table->integer('stock')->default(0)->nullable()->index(); // Indexed for stock queries, nullable for variable products
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_approved')->default(false)->index();
            $table->string('product_type', 50)->nullable();
            $table->timestamps();
            
            // Composite indexes for common queries
            $table->index(['store_id', 'is_active', 'is_approved']); // Store products listing
            $table->index(['category_id', 'is_active', 'is_approved']); // Category filtering
            $table->index(['is_approved', 'created_at']); // Admin approval queue
            
            // Full-text search index for product name (MySQL)
            // $table->fullText('name'); // Uncomment if using MySQL 5.7+
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
