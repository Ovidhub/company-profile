<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_routes_require_authentication(): void
    {
        $this->getJson('/api/admin/orders')->assertStatus(401);
        $this->postJson('/api/admin/products', [])->assertStatus(401);
        $this->getJson('/api/admin/payment-methods')->assertStatus(401);
    }

    public function test_editor_cannot_delete_anything(): void
    {
        $editor = User::factory()->create(['role' => 'editor']);
        $product = Product::create(['name' => 'P', 'price' => 10, 'image' => 'x', 'description' => 'd', 'features' => [], 'in_stock' => true]);

        $this->actingAs($editor, 'sanctum')->deleteJson("/api/admin/products/{$product->id}")->assertStatus(403);
        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }

    public function test_editor_cannot_access_payment_methods(): void
    {
        $editor = User::factory()->create(['role' => 'editor']);

        $this->actingAs($editor, 'sanctum')->getJson('/api/admin/payment-methods')->assertStatus(403);
        $this->actingAs($editor, 'sanctum')->postJson('/api/admin/payment-methods', ['name' => 'X', 'type' => 'card'])->assertStatus(403);
    }

    public function test_editor_can_update_content(): void
    {
        $editor = User::factory()->create(['role' => 'editor']);
        $product = Product::create(['name' => 'P', 'price' => 10, 'image' => 'x', 'description' => 'd', 'features' => [], 'in_stock' => true]);

        $this->actingAs($editor, 'sanctum')->putJson("/api/admin/products/{$product->id}", ['price' => 15])
            ->assertOk()->assertJsonPath('data.price', 15);
    }
}
