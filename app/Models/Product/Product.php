<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Store\Store;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'category_id',
        'name',
        'description',
        'price',
        'stock',
        'image',
        'is_active',
        'is_approved',
        'product_type',
    ];

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
        'is_active' => 'boolean',
        'is_approved' => 'boolean',
    ];

    protected $appends = ['sales_count'];

    // Relationships
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function addons()
    {
        return $this->belongsToMany(
            \App\Models\AddOn\AddOn::class,
            'product_addons',
            'product_id',
            'addon_id'
        );
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    // Accessors
    public function getSalesCountAttribute()
    {
        // For now, return 0. You can implement actual sales count logic later
        return 0;
    }
}
