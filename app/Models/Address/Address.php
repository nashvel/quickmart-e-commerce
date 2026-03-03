<?php

namespace App\Models\Address;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'address_line_1',
        'address_line_2',
        'city',
        'province',
        'postal_code',
        'type',
        'latitude',
        'longitude',
        'is_default',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_default' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }
}
