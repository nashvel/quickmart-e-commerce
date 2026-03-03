<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->index(); // Indexed for fast lookups
            $table->string('icon', 100)->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('cascade');
            $table->timestamps();
            
            // Composite index for parent-child queries
            $table->index(['parent_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
