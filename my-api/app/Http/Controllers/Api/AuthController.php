<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Handle Login and return JWT
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // Use auth('api') so it attempts login via JWT instead of sessions
        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    // Get authenticated user details
    public function userProfile()
    {
        return response()->json(auth('api')->user());
    }

    // Logout (Invalidate token)
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    // Helper method to format token response
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user() // Optional: helpful to return user profile right on login
        ]);
    }
}