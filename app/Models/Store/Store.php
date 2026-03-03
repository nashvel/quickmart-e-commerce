<?php

namespace App\Models\Store;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Product\Product;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'name',
        'description',
        'address',
        'logo',
        'cover_photo',
        'phone_number',
        'delivery_fee',
        'store_type',
        'is_active',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'delivery_fee' => 'decimal:2',
        'is_active' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    // Relationships
    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function orders()
    {
        return $this->hasMany(\App\Models\Order\Order::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('store_type', $type);
    }
}
