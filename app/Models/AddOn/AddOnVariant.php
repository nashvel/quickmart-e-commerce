<?php

namespace App\Models\AddOn;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AddOnVariant extends Model
{
    use HasFactory;

    protected $table = 'addon_variants';

    protected $fillable = [
        'addon_id',
        'name',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    // Relationships
    public function addon()
    {
        return $this->belongsTo(AddOn::class);
    }
}
