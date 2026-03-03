<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->string('name', 150)->index(); // Indexed for search
            $table->text('description')->nullable();
            $table->string('address');
            $table->string('logo')->nullable();
            $table->string('cover_photo')->nullable();
            $table->string('phone_number', 20)->nullable();
            $table->decimal('delivery_fee', 8, 2)->default(0);
            $table->enum('store_type', ['convenience', 'restaurant'])->index(); // Indexed for filtering
            $table->boolean('is_active')->default(true)->index(); // Indexed for active stores query
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->timestamps();
            
            // Composite indexes for common queries
            $table->index(['is_active', 'store_type']);
            $table->index(['latitude', 'longitude']); // For location-based queries
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
