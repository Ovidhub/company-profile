<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Message;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCrudTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
        Category::create(['slug' => 'smartphones', 'label' => 'Smartphones', 'icon' => 'Smartphone', 'sort_order' => 1, 'active' => true]);
    }

    private function asAdmin()
    {
        return $this->actingAs($this->admin, 'sanctum');
    }

    public function test_admin_can_create_product_with_spa_shape(): void
    {
        $this->asAdmin()->postJson('/api/admin/products', [
            'name' => 'Pixel 9',
            'category' => 'smartphones',
            'price' => 799,
            'originalPrice' => 899,
            'image' => 'https://example.com/p.jpg',
            'description' => 'Google Pixel 9',
            'features' => ['Tensor G4'],
            'inStock' => true,
            'badge' => 'new',
        ])->assertCreated()
            ->assertJsonPath('data.name', 'Pixel 9')
            ->assertJsonPath('data.category', 'smartphones')
            ->assertJsonPath('data.originalPrice', 899);

        $this->assertDatabaseHas('products', ['name' => 'Pixel 9', 'original_price' => 899]);
    }

    public function test_admin_can_update_and_delete_product(): void
    {
        $product = Product::create(['name' => 'Old', 'category_id' => Category::first()->id, 'price' => 10, 'image' => 'x', 'description' => 'd', 'features' => [], 'in_stock' => true]);

        $this->asAdmin()->putJson("/api/admin/products/{$product->id}", ['price' => 20])
            ->assertOk()->assertJsonPath('data.price', 20);

        $this->asAdmin()->deleteJson("/api/admin/products/{$product->id}")->assertOk();
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_category_create_generates_slug_and_delete_protects_all(): void
    {
        $this->asAdmin()->postJson('/api/admin/categories', ['label' => 'Gaming Gear'])
            ->assertCreated()->assertJsonPath('data.id', 'gaming-gear');

        Category::create(['slug' => 'all', 'label' => 'All Products', 'icon' => 'ShoppingBag', 'sort_order' => 0, 'active' => true]);
        $this->asAdmin()->deleteJson('/api/admin/categories/all')->assertStatus(422);
    }

    public function test_deleting_category_moves_products_to_other(): void
    {
        $category = Category::first();
        $product = Product::create(['name' => 'P', 'category_id' => $category->id, 'price' => 10, 'image' => 'x', 'description' => 'd', 'features' => [], 'in_stock' => true]);

        $this->asAdmin()->deleteJson("/api/admin/categories/{$category->slug}")->assertOk();

        $this->assertNull($product->fresh()->category_id);
    }

    public function test_order_status_can_be_updated_by_order_number(): void
    {
        $order = Order::create(['order_number' => 'DEE-TEST1234', 'customer_name' => 'A', 'customer_email' => 'a@b.c', 'customer_phone' => '1', 'customer_address' => 'x', 'customer_city' => 'c', 'customer_state' => 's', 'customer_zip' => 'z', 'customer_country' => 'NG', 'subtotal' => 1, 'shipping' => 0, 'tax' => 0, 'total' => 1, 'payment_method' => 'COD']);

        $this->asAdmin()->patchJson('/api/admin/orders/DEE-TEST1234', ['status' => 'shipped'])
            ->assertOk()->assertJsonPath('order.status', 'shipped');

        $this->asAdmin()->patchJson('/api/admin/orders/DEE-TEST1234', ['status' => 'bogus'])->assertStatus(422);

        $this->assertSame('shipped', $order->fresh()->status);
    }

    public function test_message_can_be_marked_read(): void
    {
        $message = Message::create(['name' => 'N', 'email' => 'n@e.com', 'subject' => 's', 'message' => 'm']);

        $this->asAdmin()->patchJson("/api/admin/messages/{$message->id}", ['read' => true])
            ->assertOk()->assertJsonPath('data.read', true);
    }

    public function test_payment_method_response_never_contains_secret(): void
    {
        PaymentMethod::create(['name' => 'Paystack', 'type' => 'paystack', 'enabled' => true, 'is_default' => true, 'secret_key' => 'sk_live_super_secret', 'sort_order' => 1]);

        $json = $this->asAdmin()->getJson('/api/admin/payment-methods')->assertOk()->content();

        $this->assertStringNotContainsString('sk_live_super_secret', $json);
        $this->assertStringContainsString('hasSecretKey', $json);
    }

    public function test_payment_method_secret_is_write_only_and_default_is_exclusive(): void
    {
        $first = PaymentMethod::create(['name' => 'A', 'type' => 'card', 'enabled' => true, 'is_default' => true, 'sort_order' => 1]);

        $this->asAdmin()->postJson('/api/admin/payment-methods', [
            'name' => 'Stripe', 'type' => 'stripe', 'secretKey' => 'sk_test_abc', 'isDefault' => true,
        ])->assertCreated()->assertJsonPath('data.hasSecretKey', true);

        $this->assertSame('sk_test_abc', PaymentMethod::where('name', 'Stripe')->first()->secret_key);
        $this->assertFalse($first->fresh()->is_default);
    }

    public function test_site_image_upsert(): void
    {
        $this->asAdmin()->putJson('/api/admin/site-images/logoFull', ['url' => 'https://cdn.example.com/logo.png'])
            ->assertOk()->assertJsonPath('url', 'https://cdn.example.com/logo.png');

        $this->assertDatabaseHas('site_images', ['key' => 'logoFull']);
    }
}
