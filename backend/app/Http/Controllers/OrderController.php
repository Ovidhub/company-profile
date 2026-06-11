<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    private const TAX_RATE = 0.08;

    private const FREE_SHIPPING_OVER = 500;

    private const SHIPPING_COST = ['std' => 25, 'exp' => 50, 'pck' => 0];

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer.name' => ['required', 'string', 'max:120'],
            'customer.email' => ['required', 'email', 'max:254'],
            'customer.phone' => ['required', 'string', 'max:30'],
            'customer.address' => ['required', 'string', 'max:200'],
            'customer.city' => ['required', 'string', 'max:80'],
            'customer.state' => ['required', 'string', 'max:80'],
            'customer.zip' => ['required', 'string', 'max:12'],
            'customer.country' => ['required', 'string', 'max:80'],
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
            'shipping_method' => ['required', 'in:std,exp,pck'],
            'payment_method_id' => ['required', 'integer'],
        ]);

        $paymentMethod = PaymentMethod::where('id', $data['payment_method_id'])->where('enabled', true)->first();
        if (! $paymentMethod) {
            throw ValidationException::withMessages(['payment_method_id' => ['Selected payment method is not available.']]);
        }

        // Prices come from the database — anything the client sends is ignored.
        $products = Product::whereIn('id', collect($data['items'])->pluck('product_id'))->get()->keyBy('id');

        $lines = collect($data['items'])->map(function (array $item) use ($products) {
            $product = $products[$item['product_id']];
            if (! $product->in_stock) {
                throw ValidationException::withMessages(['items' => ["{$product->name} is out of stock."]]);
            }

            return ['product' => $product, 'quantity' => $item['quantity']];
        });

        $subtotal = round($lines->sum(fn ($line) => $line['product']->price * $line['quantity']), 2);
        $shipping = self::SHIPPING_COST[$data['shipping_method']];
        if ($data['shipping_method'] === 'std' && $subtotal > self::FREE_SHIPPING_OVER) {
            $shipping = 0;
        }
        $tax = round($subtotal * self::TAX_RATE, 2);
        $total = round($subtotal + $shipping + $tax, 2);

        $order = DB::transaction(function () use ($data, $lines, $subtotal, $shipping, $tax, $total, $paymentMethod) {
            $order = Order::create([
                'order_number' => $this->uniqueOrderNumber(),
                'customer_name' => $data['customer']['name'],
                'customer_email' => $data['customer']['email'],
                'customer_phone' => $data['customer']['phone'],
                'customer_address' => $data['customer']['address'],
                'customer_city' => $data['customer']['city'],
                'customer_state' => $data['customer']['state'],
                'customer_zip' => $data['customer']['zip'],
                'customer_country' => $data['customer']['country'],
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'tax' => $tax,
                'total' => $total,
                'status' => 'pending',
                'payment_method' => $paymentMethod->name,
                'shipping_method' => $data['shipping_method'],
            ]);

            foreach ($lines as $line) {
                $order->items()->create([
                    'product_id' => $line['product']->id,
                    'name' => $line['product']->name,
                    'price' => $line['product']->price,
                    'quantity' => $line['quantity'],
                    'image' => $line['product']->image,
                ]);
            }

            return $order;
        });

        return (new OrderResource($order->load('items')))
            ->additional([])
            ->response()
            ->setStatusCode(201);
    }

    private function uniqueOrderNumber(): string
    {
        do {
            $number = 'DEE-'.strtoupper(Str::random(8));
        } while (Order::where('order_number', $number)->exists());

        return $number;
    }
}
