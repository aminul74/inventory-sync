<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Session;

class GoogleTokenManager
{
    private const TOKEN_KEY = 'google_access_token';
    private const REFRESH_KEY = 'google_refresh_token';
    private const EXPIRES_KEY = 'google_token_expires_at';
    private const USER_KEY = 'google_user';

    /**
     * Store tokens and user data
     */
    public function store(array $tokens, array $user): void
    {
        Session::put(self::TOKEN_KEY, $tokens['access_token'] ?? null);
        Session::put(self::REFRESH_KEY, $tokens['refresh_token'] ?? null);
        Session::put(
            self::EXPIRES_KEY,
            now()->addSeconds($tokens['expires_in'] ?? 3600)
        );

        $this->storeUser($user);
    }

    /**
     * Store user data
     */
    public function storeUser(array $user): void
    {
        Session::put(self::USER_KEY, [
            'id' => $user['id'] ?? null,
            'email' => $user['email'] ?? null,
            'name' => $user['name'] ?? null,
            'picture' => $user['picture'] ?? null,
        ]);
    }

    /**
     * Get stored user data
     */
    public function getUser(): ?array
    {
        return Session::get(self::USER_KEY);
    }

    /**
     * Get access token
     */
    public function getToken(): ?string
    {
        return Session::get(self::TOKEN_KEY);
    }

    /**
     * Clear all tokens and user data
     */
    public function clear(): void
    {
        Session::forget([
            self::TOKEN_KEY,
            self::REFRESH_KEY,
            self::EXPIRES_KEY,
            self::USER_KEY,
        ]);
    }

    /**
     * Check if user is authenticated
     */
    public function isAuthenticated(): bool
    {
        return !empty($this->getUser()) && !empty($this->getToken());
    }

    /**
     * Get user from database by user_id
     */
    public function getUserById(int $userId): ?User
    {
        return User::find($userId);
    }
}
