<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name', 'type', 'enabled', 'is_default', 'description', 'icon',
    'bank_name', 'account_name', 'account_number', 'routing_number', 'swift_code', 'bank_address',
    'public_key', 'secret_key', 'cod_instructions', 'custom_instructions', 'sort_order',
])]
class PaymentMethod extends Model
{
    public const TYPES = ['bank_transfer', 'paystack', 'flutterwave', 'card', 'cash_on_delivery', 'paypal', 'stripe', 'custom'];

    protected function casts(): array
    {
        return [
            'enabled' => 'boolean',
            'is_default' => 'boolean',
            'sort_order' => 'integer',
            // Encrypted at rest; additionally hidden from all serialization.
            'secret_key' => 'encrypted',
        ];
    }

    protected $hidden = ['secret_key'];
}
