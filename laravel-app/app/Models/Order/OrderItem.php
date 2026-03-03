<?php

namespace App\Models\Order;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Product\Product;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'variant_id',
        'quantity',
        'price',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
    ];

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
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
        return $this->hasMany(OrderItemAddon::class);
    }

    // Accessor
    public function getTotalPriceAttribute()
    {
        $addonsTotal = $this->addons->sum(function ($addon) {
            return $addon->price * $addon->quantity;
        });
        
        return ($this->price + $addonsTotal) * $this->quantity;
    }
}
