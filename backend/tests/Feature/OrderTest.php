<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\PaymentMethod;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private Product $phone;

    private Product $mouse;

    private PaymentMethod $paymentMethod;

    protected function setUp(): void
    {
        parent::setUp();

        $category = Category::create(['slug' => 'smartphones', 'label' => 'Smartphones', 'icon' => 'Smartphone', 'sort_order' => 1, 'active' => true]);
        $this->phone = Product::create(['name' => 'Phone', 'category_id' => $category->id, 'price' => 300, 'image' => 'x.jpg', 'description' => 'A phone', 'features' => [], 'in_stock' => true]);
        $this->mouse = Product::create(['name' => 'Mouse', 'category_id' => $category->id, 'price' => 50, 'image' => 'y.jpg', 'description' => 'A mouse', 'features' => [], 'in_stock' => true]);
        $this->paymentMethod = PaymentMethod::create(['name' => 'Cash on Delivery', 'type' => 'cash_on_delivery', 'enabled' => true, 'is_default' => true, 'sort_order' => 1]);
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'customer' => [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '+234 800 000 0000',
                'address' => '1 Main St',
                'city' => 'Abuja',
                'state' => 'FCT',
                'zip' => '900001',
                'country' => 'Nigeria',
            ],
            'items' => [
                ['product_id' => $this->phone->id, 'quantity' => 1],
                ['product_id' => $this->mouse->id, 'quantity' => 2],
            ],
            'shipping_method' => 'std',
            'payment_method_id' => $this->paymentMethod->id,
        ], $overrides);
    }

    public function test_order_totals_are_computed_server_side(): void
    {
        // subtotal 300 + 2*50 = 400; std shipping (not over 500) = 25; tax 8% = 32
        $response = $this->postJson('/api/orders', $this->payload());

        $response->assertCreated()
            ->assertJsonPath('order.subtotal', 400)
            ->assertJsonPath('order.shipping', 25)
            ->assertJsonPath('order.tax', 32)
            ->assertJsonPath('order.total', 457)
            ->assertJsonPath('order.status', 'pending')
            ->assertJsonPath('order.paymentMethod', 'Cash on Delivery');

        $this->assertStringStartsWith('DEE-', $response->json('order.id'));
    }

    public function test_forged_prices_in_request_are_ignored(): void
    {
        $payload = $this->payload();
        $payload['items'][0]['price'] = 0.01;
        $payload['subtotal'] = 1;
        $payload['total'] = 1;

        $this->postJson('/api/orders', $payload)
            ->assertCreated()
            ->assertJsonPath('order.total', 457);
    }

    public function test_free_shipping_over_threshold(): void
    {
        $payload = $this->payload(['items' => [['product_id' => $this->phone->id, 'quantity' => 2]]]);
        // subtotal 600 > 500 → std shipping free; tax 48; total 648

        $this->postJson('/api/orders', $payload)
            ->assertCreated()
            ->assertJsonPath('order.shipping', 0)
            ->assertJsonPath('order.total', 648);
    }

    public function test_express_shipping_costs_50(): void
    {
        $this->postJson('/api/orders', $this->payload(['shipping_method' => 'exp']))
            ->assertCreated()
            ->assertJsonPath('order.shipping', 50);
    }

    public function test_unknown_product_is_rejected(): void
    {
        $payload = $this->payload(['items' => [['product_id' => 99999, 'quantity' => 1]]]);

        $this->postJson('/api/orders', $payload)->assertStatus(422);
    }

    public function test_out_of_stock_product_is_rejected(): void
    {
        $this->phone->update(['in_stock' => false]);

        $this->postJson('/api/orders', $this->payload())->assertStatus(422);
    }

    public function test_excessive_quantity_is_rejected(): void
    {
        $payload = $this->payload(['items' => [['product_id' => $this->phone->id, 'quantity' => 100]]]);

        $this->postJson('/api/orders', $payload)->assertStatus(422);
    }

    public function test_disabled_payment_method_is_rejected(): void
    {
        $this->paymentMethod->update(['enabled' => false]);

        $this->postJson('/api/orders', $this->payload())->assertStatus(422);
    }

    public function test_order_items_snapshot_product_data(): void
    {
        $this->postJson('/api/orders', $this->payload())->assertCreated();

        $this->assertDatabaseHas('order_items', [
            'product_id' => $this->phone->id,
            'name' => 'Phone',
            'price' => 300,
            'quantity' => 1,
        ]);
    }
}
