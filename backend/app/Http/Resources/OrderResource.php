<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Serializes an Order in the SPA's Order shape (id = order_number). */
class OrderResource extends JsonResource
{
    public static $wrap = 'order';

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->order_number,
            'customer' => [
                'name' => $this->customer_name,
                'email' => $this->customer_email,
                'phone' => $this->customer_phone,
                'address' => $this->customer_address,
                'city' => $this->customer_city,
                'state' => $this->customer_state,
                'zip' => $this->customer_zip,
                'country' => $this->customer_country,
            ],
            'items' => $this->items->map(fn ($item) => [
                'productId' => (string) $item->product_id,
                'name' => $item->name,
                'price' => (float) $item->price,
                'quantity' => (int) $item->quantity,
                'image' => $item->image,
            ]),
            'subtotal' => (float) $this->subtotal,
            'shipping' => (float) $this->shipping,
            'tax' => (float) $this->tax,
            'total' => (float) $this->total,
            'status' => $this->status,
            'paymentMethod' => $this->payment_method,
            'date' => $this->created_at?->format('Y-m-d') ?? '',
        ];
    }
}
