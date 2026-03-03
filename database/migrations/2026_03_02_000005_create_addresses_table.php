<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('full_name', 150);
            $table->string('phone', 20);
            $table->string('line1');
            $table->string('city', 100)->index(); // Indexed for city-based queries
            $table->string('province', 100)->nullable();
            $table->string('zip_code', 10);
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
            
            // Composite indexes for common queries
            $table->index(['user_id', 'is_default']); // Get user's default address
            $table->index(['latitude', 'longitude']); // Location-based queries
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
