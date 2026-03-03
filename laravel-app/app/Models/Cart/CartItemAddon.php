<?php

namespace App\Models\Cart;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\AddOn\AddOn;

class CartItemAddon extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_item_id',
        'addon_id',
        'addon_variant_id',
        'quantity',
        'price',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
    ];

    // Relationships
    public function cartItem()
    {
        return $this->belongsTo(CartItem::class);
    }

    public function addon()
    {
        return $this->belongsTo(AddOn::class);
    }

    public function addonVariant()
    {
        return $this->belongsTo(\App\Models\AddOn\AddOnVariant::class, 'addon_variant_id');
    }
}
