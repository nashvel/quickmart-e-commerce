<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained('addon_categories')->onDelete('set null');
            $table->string('name', 150)->index();
            $table->decimal('price', 10, 2);
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            
            // Composite index for store addons
            $table->index(['store_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addons');
    }
};
