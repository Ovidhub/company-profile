<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicContentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_content_bundle_has_all_sections(): void
    {
        $this->getJson('/api/content')
            ->assertOk()
            ->assertJsonStructure([
                'heroSlides' => [['id', 'title', 'subtitle', 'image', 'tag', 'iconName']],
                'testimonials' => [['id', 'name', 'role', 'text', 'rating']],
                'images',
                'categories' => [['id', 'label', 'icon', 'order', 'active']],
                'products' => [['id', 'name', 'category', 'categoryLabel', 'price', 'image', 'features', 'inStock', 'rating', 'reviews']],
                'paymentMethods' => [['id', 'name', 'type', 'enabled', 'isDefault', 'order']],
            ]);
    }

    public function test_content_never_exposes_gateway_secrets(): void
    {
        $json = $this->getJson('/api/content')->assertOk()->content();

        $this->assertStringNotContainsString('secret_key', $json);
        $this->assertStringNotContainsString('secretKey', $json);
        $this->assertStringNotContainsString('sk_test', $json);
    }

    public function test_content_excludes_disabled_payment_methods(): void
    {
        $methods = $this->getJson('/api/content')->json('paymentMethods');

        $this->assertNotEmpty($methods);
        foreach ($methods as $method) {
            $this->assertTrue($method['enabled']);
        }
    }

    public function test_content_serializes_ids_for_the_spa(): void
    {
        $response = $this->getJson('/api/content');

        // Product ids are strings; categories are keyed by slug.
        $this->assertIsString($response->json('products.0.id'));
        $this->assertSame('all', $response->json('categories.0.id'));
        // Images come back as a key => url map.
        $this->assertArrayHasKey('logoFull', $response->json('images'));
    }

    public function test_contact_message_can_be_submitted(): void
    {
        $this->postJson('/api/messages', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'subject' => 'Hello',
            'message' => 'I have a question.',
        ])->assertCreated();

        $this->assertDatabaseHas('messages', ['email' => 'jane@example.com', 'read' => false]);
    }

    public function test_contact_message_requires_valid_email(): void
    {
        $this->postJson('/api/messages', [
            'name' => 'Jane',
            'email' => 'not-an-email',
            'subject' => 'Hi',
            'message' => 'Test',
        ])->assertStatus(422);
    }

    public function test_contact_form_is_rate_limited(): void
    {
        $payload = ['name' => 'J', 'email' => 'j@e.com', 'subject' => 's', 'message' => 'm'];
        for ($i = 0; $i < 10; $i++) {
            $this->postJson('/api/messages', $payload);
        }

        $this->postJson('/api/messages', $payload)->assertStatus(429);
    }
}
