<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private function makeAdmin(): User
    {
        return User::factory()->create([
            'email' => 'admin@example.com',
            'password' => 'secret-pass',
            'role' => 'admin',
        ]);
    }

    public function test_login_returns_token_and_user(): void
    {
        $this->makeAdmin();

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'secret-pass',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'user' => ['name', 'email', 'role']])
            ->assertJsonPath('user.role', 'admin');
    }

    public function test_login_with_wrong_password_fails(): void
    {
        $this->makeAdmin();

        $this->postJson('/api/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'wrong',
        ])->assertStatus(422);
    }

    public function test_login_is_rate_limited(): void
    {
        $this->makeAdmin();

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/auth/login', ['email' => 'admin@example.com', 'password' => 'wrong']);
        }

        $this->postJson('/api/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'wrong',
        ])->assertStatus(429);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/auth/me')->assertStatus(401);
    }

    public function test_me_returns_current_user(): void
    {
        $user = $this->makeAdmin();
        $token = $user->createToken('admin')->plainTextToken;

        $this->withToken($token)->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'admin@example.com');
    }

    public function test_logout_revokes_token(): void
    {
        $user = $this->makeAdmin();
        $token = $user->createToken('admin')->plainTextToken;

        $this->withToken($token)->postJson('/api/auth/logout')->assertOk();

        $this->assertSame(0, $user->tokens()->count());
    }
}
