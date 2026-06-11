<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'name', 'category_id', 'price', 'original_price', 'image', 'description',
    'features', 'in_stock', 'rating', 'reviews', 'badge',
])]
class Product extends Model
{
    protected function casts(): array
    {
        return [
            'features' => 'array',
            'in_stock' => 'boolean',
            'price' => 'float',
            'original_price' => 'float',
            'rating' => 'float',
            'reviews' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
