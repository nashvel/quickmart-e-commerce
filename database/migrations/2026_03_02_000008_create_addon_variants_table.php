<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addon_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('addon_id')->constrained('addons')->onDelete('cascade');
            $table->string('name', 150);
            $table->decimal('price', 10, 2);
            $table->timestamps();
            
            // Index for addon variants
            $table->index('addon_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addon_variants');
    }
};
