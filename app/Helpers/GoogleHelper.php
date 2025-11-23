<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;

class GoogleHelper
{
    /**
     * Generate the Shopify admin OAuth redirect URL.
     *
     * @return string
     */
    public static function redirectToShopifyAdmin(): string
    {
        $store = env('SHOPIFY_STORE_NAME');
        $clientId = env('SHOPIFY_API_KEY');
        return 'https://' . $store . './admin/oauth/redirect_from_cli?client_id=' . $clientId;
    }


    /**
     * Get the Shopify user ID from the database.
     * Public wrapper for the private database function.
     *
     * @param string|null $shop Optional shop name. If null, uses SHOPIFY_STORE_NAME env.
     * @return int|null The user ID, or null if not found.
     */
    public static function getShopifyUserId(?string $shop = null): ?int
    {
        $result = self::getUserIdByShopifyStoreName($shop);
        return $result['user_id'];
    }

    /**
     * Get user ID by Shopify store name.
     *
     * @param string|null $shop The Shopify store name. If null, uses env variable.
     * @return array{shop: ?string, user_id: ?int}
     */

    private static function getUserIdByShopifyStoreName(?string $shop = null): array
    {
        // If shop not passed, fallback to env
        $shopName = $shop ?? env('SHOPIFY_STORE_NAME');

        if (!$shopName) {
            return [
                'shop' => null,
                'user_id' => null,
            ];
        }

        // Sanitize shop domain if helper exists
        if (class_exists(ShopHelper::class)) {
            $shopName = ShopHelper::sanitizeShopDomain($shopName);
        }

        // Fetch user ID
        $user = DB::table('users')
            ->select('id')
            ->where('name', $shopName)
            ->first();

        return [
            'shop' => $shopName,
            'user_id' => $user ? $user->id : null,
        ];
    }


    /**
     * Get Google client ID from env or config.
     */
    public static function getGoogleClientId(): ?string
    {
        return env('GOOGLE_CLIENT_ID') ?: config('services.google.client_id');
    }

    /**
     * Get Google client secret from env or config.
     */
    public static function getGoogleClientSecret(): ?string
    {
        return env('GOOGLE_CLIENT_SECRET') ?: config('services.google.client_secret');
    }

    /**
     * Get Google redirect URI from env or config. If not set, attempt to build
     * one from `APP_URL` using the conventional callback path `/google/callback`.
     */
    public static function getGoogleRedirectUri(): ?string
    {
        $uri = env('GOOGLE_REDIRECT_URI') ?: config('services.google.redirect_uri');
        if ($uri) {
            return $uri;
        }

        $appUrl = env('APP_URL');
        if ($appUrl) {
            return rtrim($appUrl, '/') . '/google/callback';
        }

        return null;
    }

    /**
     * Validate Google env/config and throw an exception if incomplete.
     *
     * @throws \Exception
     */
    public static function validateGoogleConfig(): void
    {
        $clientId = self::getGoogleClientId();
        $clientSecret = self::getGoogleClientSecret();
        $redirect = self::getGoogleRedirectUri();

        if (!$clientId || !$clientSecret || !$redirect) {
            throw new \Exception('Google OAuth configuration incomplete (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)');
        }
    }

    /**
     * Build the Google OAuth authorization URL using env/config values.
     * This mirrors the behavior in `App\Services\GoogleOAuthService` but
     * is provided for convenience to other non-service code.
     */
    public static function getGoogleAuthorizationUrl(): string
    {
        self::validateGoogleConfig();

        $params = [
            'client_id' => self::getGoogleClientId(),
            'redirect_uri' => self::getGoogleRedirectUri(),
            'response_type' => 'code',
            'scope' => 'email profile https://www.googleapis.com/auth/spreadsheets',
            'access_type' => 'offline',
            'prompt' => 'consent',
        ];

        return 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);
    }
}
