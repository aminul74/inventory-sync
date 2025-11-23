<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleOAuthService
{
    private const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
    private const TOKEN_URL = 'https://oauth2.googleapis.com/token';
    private const USERINFO_URL = 'https://www.googleapis.com/oauth2/v1/userinfo';
    private const REVOKE_URL = 'https://oauth2.googleapis.com/revoke';

    /**
     * Generate Google OAuth authorization URL
     */
    public function getAuthorizationUrl(): string
    {
        $this->validateConfig();

        $params = [
            'client_id' => config('services.google.client_id'),
            'redirect_uri' => config('services.google.redirect_uri'),
            'response_type' => 'code',
            'scope' => 'email profile https://www.googleapis.com/auth/spreadsheets',
            'access_type' => 'offline',
            'prompt' => 'consent',
        ];

        return self::AUTH_URL . '?' . http_build_query($params);
    }

    /**
     * Exchange authorization code for tokens
     */
    public function getTokens(string $code): array
    {
        $this->validateConfig();

        try {
            $response = Http::post(self::TOKEN_URL, [
                'client_id' => config('services.google.client_id'),
                'client_secret' => config('services.google.client_secret'),
                'code' => $code,
                'grant_type' => 'authorization_code',
                'redirect_uri' => config('services.google.redirect_uri'),
            ]);

            if (!$response->successful()) {
                Log::error('Token exchange failed', ['response' => $response->json()]);
                throw new \Exception('Token exchange failed');
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Token exchange error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Fetch user information from Google
     */
    public function getUserInfo(string $accessToken): array
    {
        try {
            $response = Http::withToken($accessToken)->get(self::USERINFO_URL);

            if (!$response->successful()) {
                Log::error('Failed to fetch user info');
                throw new \Exception('Failed to fetch user info');
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('User info fetch error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Revoke access token
     */
    public function revokeToken(string $accessToken): void
    {
        try {
            Http::post(self::REVOKE_URL, ['token' => $accessToken]);
            Log::info('Token revoked successfully');
        } catch (\Exception $e) {
            Log::warning('Token revocation failed: ' . $e->getMessage());
        }
    }

    /**
     * Validate Google configuration
     */
    private function validateConfig(): void
    {
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');
        $redirectUri = config('services.google.redirect_uri');

        if (!$clientId || !$clientSecret || !$redirectUri) {
            throw new \Exception('Google OAuth configuration incomplete');
        }
    }
}
