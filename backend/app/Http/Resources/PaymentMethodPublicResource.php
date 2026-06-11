<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Customer-facing payment method shape. Gateway credentials (secret_key,
 * public_key) are deliberately absent — never add them here.
 */
class PaymentMethodPublicResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'enabled' => (bool) $this->enabled,
            'isDefault' => (bool) $this->is_default,
            'description' => $this->description,
            'icon' => $this->icon,
            'bankName' => $this->bank_name,
            'accountName' => $this->account_name,
            'accountNumber' => $this->account_number,
            'routingNumber' => $this->routing_number,
            'swiftCode' => $this->swift_code,
            'bankAddress' => $this->bank_address,
            'codInstructions' => $this->cod_instructions,
            'customInstructions' => $this->custom_instructions,
            'order' => (int) $this->sort_order,
        ];
    }
}
