<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_upload_requires_authentication(): void
    {
        $this->postJson('/api/admin/uploads')->assertStatus(401);
    }

    public function test_valid_image_upload_returns_url(): void
    {
        Storage::fake('public');
        $user = User::factory()->create(['role' => 'editor']);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/admin/uploads', [
            'image' => UploadedFile::fake()->image('photo.jpg', 800, 600),
        ]);

        $response->assertCreated();
        $this->assertStringContainsString('/storage/uploads/', $response->json('url'));
        $this->assertNotEmpty(Storage::disk('public')->files('uploads'));
    }

    public function test_svg_upload_is_rejected(): void
    {
        Storage::fake('public');
        $user = User::factory()->create(['role' => 'admin']);

        $svg = UploadedFile::fake()->createWithContent('image.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

        $this->actingAs($user, 'sanctum')->postJson('/api/admin/uploads', ['image' => $svg])
            ->assertStatus(422);
    }

    public function test_oversized_upload_is_rejected(): void
    {
        Storage::fake('public');
        $user = User::factory()->create(['role' => 'admin']);

        $big = UploadedFile::fake()->create('big.jpg', 6000, 'image/jpeg');

        $this->actingAs($user, 'sanctum')->postJson('/api/admin/uploads', ['image' => $big])
            ->assertStatus(422);
    }
}
