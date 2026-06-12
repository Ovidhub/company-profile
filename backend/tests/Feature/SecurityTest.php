<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\PaymentMethod;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_responses_carry_security_headers(): void
    {
        $response = $this->getJson('/api/content');

        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $this->assertStringContainsString("frame-ancestors 'none'", $response->headers->get('Content-Security-Policy'));
    }

    public function test_sql_injection_payloads_are_treated_as_data(): void
    {
        // A classic injection payload through the contact form must be stored
        // verbatim as text, not executed — and must not error.
        $payload = "'; DROP TABLE messages; --";

        $this->postJson('/api/messages', [
            'name' => $payload,
            'email' => 'attacker@example.com',
            'subject' => "1 OR 1=1",
            'message' => 'Robert\'); DROP TABLE students;--',
        ])->assertCreated();

        // Table still exists and the payload is inert data inside it.
        $this->assertDatabaseHas('messages', ['name' => $payload, 'email' => 'attacker@example.com']);
    }

    public function test_sql_injection_in_order_product_ids_is_rejected(): void
    {
        $category = Category::create(['slug' => 'c', 'label' => 'C', 'icon' => 'ShoppingBag', 'sort_order' => 1, 'active' => true]);
        Product::create(['name' => 'P', 'category_id' => $category->id, 'price' => 10, 'image' => 'x', 'description' => 'd', 'features' => [], 'in_stock' => true]);
        $pm = PaymentMethod::create(['name' => 'COD', 'type' => 'cash_on_delivery', 'enabled' => true, 'is_default' => true, 'sort_order' => 1]);

        $this->postJson('/api/orders', [
            'customer' => ['name' => 'A', 'email' => 'a@b.c', 'phone' => '123456789', 'address' => 'x', 'city' => 'c', 'state' => 's', 'zip' => 'z', 'country' => 'NG'],
            'items' => [['product_id' => '1 OR 1=1', 'quantity' => 1]],
            'shipping_method' => 'std',
            'payment_method_id' => $pm->id,
        ])->assertStatus(422);
    }

    public function test_login_rejects_injection_shaped_credentials(): void
    {
        $this->postJson('/api/auth/login', [
            'email' => "admin@example.com' OR '1'='1",
            'password' => "' OR '1'='1' --",
        ])->assertStatus(422);
    }

    public function test_oversized_form_input_is_rejected(): void
    {
        $this->postJson('/api/messages', [
            'name' => 'A',
            'email' => 'a@b.c',
            'subject' => 's',
            'message' => str_repeat('x', 2001),
        ])->assertStatus(422);
    }
}
