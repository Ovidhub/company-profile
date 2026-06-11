<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'order_number', 'customer_name', 'customer_email', 'customer_phone',
    'customer_address', 'customer_city', 'customer_state', 'customer_zip', 'customer_country',
    'subtotal', 'shipping', 'tax', 'total', 'status', 'payment_method', 'shipping_method',
])]
class Order extends Model
{
    public const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    protected function casts(): array
    {
        return [
            'subtotal' => 'float',
            'shipping' => 'float',
            'tax' => 'float',
            'total' => 'float',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'order_number';
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
