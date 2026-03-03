<?php

namespace App\Models\Cart;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Product\Product;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'product_id',
        'variant_id',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(\App\Models\Product\ProductVariant::class, 'variant_id');
    }

    public function addons()
    {
        return $this->hasMany(CartItemAddon::class);
    }

    // Accessors
    public function getTotalPriceAttribute()
    {
        $basePrice = $this->variant ? $this->variant->price : $this->product->price;
        $addonsPrice = $this->addons->sum(function ($addon) {
            return $addon->price * $addon->quantity;
        });
        
        return ($basePrice + $addonsPrice) * $this->quantity;
    }
}
