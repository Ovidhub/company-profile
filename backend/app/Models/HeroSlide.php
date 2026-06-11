<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'subtitle', 'image', 'tag', 'icon_name', 'sort_order'])]
class HeroSlide extends Model
{
    protected function casts(): array
    {
        return ['sort_order' => 'integer'];
    }
}
