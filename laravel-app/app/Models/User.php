<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'role',
        'avatar',
        'is_verified',
        'is_blacklisted',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
            'is_blacklisted' => 'boolean',
        ];
    }

    // Relationships
    public function addresses()
    {
        return $this->hasMany(Address\Address::class);
    }

    public function cartItems()
    {
        return $this->hasMany(Cart\CartItem::class);
    }

    public function orders()
    {
        return $this->hasMany(Order\Order::class, 'customer_id');
    }

    public function store()
    {
        return $this->hasOne(Store\Store::class, 'client_id');
    }
}
