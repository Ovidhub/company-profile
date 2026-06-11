<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Serializes a Product in the camelCase shape the SPA's Product type expects. */
class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'category' => $this->category?->slug ?? 'other',
            'categoryLabel' => $this->category?->label ?? 'Other',
            'price' => (float) $this->price,
            'originalPrice' => $this->original_price !== null ? (float) $this->original_price : null,
            'image' => $this->image,
            'description' => $this->description,
            'features' => $this->features ?? [],
            'inStock' => (bool) $this->in_stock,
            'rating' => (float) $this->rating,
            'reviews' => (int) $this->reviews,
            'badge' => $this->badge,
        ];
    }
}
