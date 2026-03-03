<?php

namespace App\Models\AddOn;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AddOnCategory extends Model
{
    use HasFactory;

    protected $table = 'addon_categories';

    protected $fillable = [
        'name',
        'description',
    ];

    // Relationships
    public function addons()
    {
        return $this->hasMany(AddOn::class, 'category_id');
    }
}
