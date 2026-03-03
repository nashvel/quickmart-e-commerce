<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            // Drop old columns if they exist
            if (Schema::hasColumn('addresses', 'full_name')) {
                $table->dropColumn('full_name');
            }
            if (Schema::hasColumn('addresses', 'phone')) {
                $table->dropColumn('phone');
            }
            if (Schema::hasColumn('addresses', 'line1')) {
                $table->dropColumn('line1');
            }
            if (Schema::hasColumn('addresses', 'zip_code')) {
                $table->dropColumn('zip_code');
            }
            
            // Add new columns if they don't exist
            if (!Schema::hasColumn('addresses', 'name')) {
                $table->string('name')->after('user_id');
            }
            if (!Schema::hasColumn('addresses', 'address_line_1')) {
                $table->string('address_line_1')->after('name');
            }
            if (!Schema::hasColumn('addresses', 'address_line_2')) {
                $table->string('address_line_2')->nullable()->after('address_line_1');
            }
            if (!Schema::hasColumn('addresses', 'postal_code')) {
                $table->string('postal_code')->after('province');
            }
            if (!Schema::hasColumn('addresses', 'type')) {
                $table->enum('type', ['home', 'work', 'other'])->default('home')->after('postal_code');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            // Remove new columns
            if (Schema::hasColumn('addresses', 'name')) {
                $table->dropColumn('name');
            }
            if (Schema::hasColumn('addresses', 'address_line_1')) {
                $table->dropColumn('address_line_1');
            }
            if (Schema::hasColumn('addresses', 'address_line_2')) {
                $table->dropColumn('address_line_2');
            }
            if (Schema::hasColumn('addresses', 'postal_code')) {
                $table->dropColumn('postal_code');
            }
            if (Schema::hasColumn('addresses', 'type')) {
                $table->dropColumn('type');
            }
            
            // Add back old columns
            if (!Schema::hasColumn('addresses', 'full_name')) {
                $table->string('full_name')->after('user_id');
            }
            if (!Schema::hasColumn('addresses', 'phone')) {
                $table->string('phone', 20)->after('full_name');
            }
            if (!Schema::hasColumn('addresses', 'line1')) {
                $table->string('line1')->after('phone');
            }
            if (!Schema::hasColumn('addresses', 'zip_code')) {
                $table->string('zip_code', 10)->after('province');
            }
        });
    }
};