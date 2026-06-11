<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentMethodAdminResource;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    public function index()
    {
        return PaymentMethodAdminResource::collection(PaymentMethod::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        $method = PaymentMethod::create($data + ['sort_order' => (int) PaymentMethod::max('sort_order') + 1]);
        $this->ensureSingleDefault($method);

        return new PaymentMethodAdminResource($method->refresh());
    }

    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        $paymentMethod->update($this->validated($request, partial: true));
        $this->ensureSingleDefault($paymentMethod);

        return new PaymentMethodAdminResource($paymentMethod->fresh());
    }

    public function destroy(PaymentMethod $paymentMethod)
    {
        $paymentMethod->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function ensureSingleDefault(PaymentMethod $method): void
    {
        if ($method->fresh()->is_default) {
            PaymentMethod::whereKeyNot($method->id)->update(['is_default' => false]);
        }
    }

    /** Accepts the SPA's camelCase shape. secretKey is write-only. */
    private function validated(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        $data = $request->validate([
            'name' => [$required, 'string', 'max:100'],
            'type' => [$required, 'in:'.implode(',', PaymentMethod::TYPES)],
            'enabled' => ['sometimes', 'boolean'],
            'isDefault' => ['sometimes', 'boolean'],
            'description' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string', 'max:20'],
            'bankName' => ['nullable', 'string', 'max:120'],
            'accountName' => ['nullable', 'string', 'max:120'],
            'accountNumber' => ['nullable', 'string', 'max:40'],
            'routingNumber' => ['nullable', 'string', 'max:40'],
            'swiftCode' => ['nullable', 'string', 'max:20'],
            'bankAddress' => ['nullable', 'string', 'max:200'],
            'publicKey' => ['nullable', 'string', 'max:200'],
            'secretKey' => ['nullable', 'string', 'max:200'],
            'codInstructions' => ['nullable', 'string', 'max:1000'],
            'customInstructions' => ['nullable', 'string', 'max:1000'],
        ]);

        $map = [
            'isDefault' => 'is_default', 'bankName' => 'bank_name', 'accountName' => 'account_name',
            'accountNumber' => 'account_number', 'routingNumber' => 'routing_number', 'swiftCode' => 'swift_code',
            'bankAddress' => 'bank_address', 'publicKey' => 'public_key', 'secretKey' => 'secret_key',
            'codInstructions' => 'cod_instructions', 'customInstructions' => 'custom_instructions',
        ];

        $mapped = [];
        foreach ($data as $key => $value) {
            $mapped[$map[$key] ?? $key] = $value;
        }

        return $mapped;
    }
}
