<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Categories are keyed by slug in the SPA, so `id` serializes as the slug. */
class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->slug,
            'label' => $this->label,
            'icon' => $this->icon,
            'description' => $this->description,
            'order' => (int) $this->sort_order,
            'active' => (bool) $this->active,
        ];
    }
}
