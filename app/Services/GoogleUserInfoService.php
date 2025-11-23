<?php

namespace App\Services;

use App\Models\User;
use App\Models\GoogleUserInfo;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GoogleUserInfoService
{
    /**
     * Store or update Google user information
     */
    public function storeOrUpdate(int $userId, array $googleUser, array $tokenData): GoogleUserInfo
    {
        $googleUserInfo = GoogleUserInfo::firstOrNew(['user_id' => $userId]);

        $tokenExpiresAt = null;
        if (isset($tokenData['expires_in'])) {
            $tokenExpiresAt = Carbon::now()->addSeconds($tokenData['expires_in']);
        }


        Log::info('Success!!! Storing Google user info', ['user_id' => $userId, 'google_id' => $googleUser['id'] ?? null]);

        $googleUserInfo->fill([
            'user_id' => $userId,
            'google_id' => $googleUser['id'] ?? null,
            'email' => $googleUser['email'] ?? null,
            'verified_email' => $googleUser['verified_email'] ?? false,
            'name' => $googleUser['name'] ?? null,
            'given_name' => $googleUser['given_name'] ?? null,
            'family_name' => $googleUser['family_name'] ?? null,
            'picture' => $googleUser['picture'] ?? null,
            'access_token' => $tokenData['access_token'] ?? null,
            'refresh_token' => $tokenData['refresh_token'] ?? null,
            'expires_in' => $tokenData['expires_in'] ?? null,
            'token_expires_at' => $tokenExpiresAt,
        ])->save();

        return $googleUserInfo;
    }

    /**
     * Get Google user info by user ID
     */
    public function getByUserId(int $userId): ?GoogleUserInfo
    {
        return GoogleUserInfo::where('user_id', $userId)->first();
    }

    /**
     * Get Google user info by Google ID
     */
    public function getByGoogleId(string $googleId): ?GoogleUserInfo
    {
        return GoogleUserInfo::where('google_id', $googleId)->first();
    }

    /**
     * Check if token is expired
     */
    public function isTokenExpired(GoogleUserInfo $googleUserInfo): bool
    {
        if (!$googleUserInfo->token_expires_at) {
            return false;
        }

        return Carbon::now()->isAfter($googleUserInfo->token_expires_at);
    }

    /**
     * Update access token
     */
    public function updateAccessToken(GoogleUserInfo $googleUserInfo, string $accessToken, ?string $refreshToken = null, ?int $expiresIn = null): GoogleUserInfo
    {
        $tokenExpiresAt = null;
        if ($expiresIn) {
            $tokenExpiresAt = Carbon::now()->addSeconds($expiresIn);
        }

        $googleUserInfo->update([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken ?? $googleUserInfo->refresh_token,
            'expires_in' => $expiresIn,
            'token_expires_at' => $tokenExpiresAt,
        ]);

        return $googleUserInfo;
    }

    /**
     * Delete Google user info
     */
    public function delete(GoogleUserInfo $googleUserInfo): bool
    {
        return $googleUserInfo->delete();
    }
}
