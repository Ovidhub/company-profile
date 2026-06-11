<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', strtolower(trim($data['email'])))->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password.'],
            ]);
        }

        // Single active session per user.
        $user->tokens()->delete();
        $token = $user->createToken('admin')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->only(['name', 'email', 'role']),
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->only(['name', 'email', 'role']),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out.']);
    }
}
