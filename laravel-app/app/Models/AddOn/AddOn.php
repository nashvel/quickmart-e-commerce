<?php

namespace App\Models\AddOn;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Store\Store;

class AddOn extends Model
{
    use HasFactory;

    protected $table = 'addons';

    protected $fillable = [
        'store_id',
        'category_id',
        'name',
        'price',
        'image',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function category()
    {
        return $this->belongsTo(AddOnCategory::class, 'category_id');
    }

    public function variants()
    {
        return $this->hasMany(AddOnVariant::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
