<?php

namespace App\Models\Order;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Store\Store;
use App\Models\Address\Address;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'store_id',
        'rider_id',
        'delivery_address_id',
        'total_amount',
        'delivery_fee',
        'status',
        'payment_method',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
    ];

    // Relationships
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_id');
    }

    public function address()
    {
        return $this->belongsTo(Address::class, 'delivery_address_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
