<?php

namespace App\Services;

use App\Models\GoogleUserInfo;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class GoogleSheetsService
{
    private Client $client;
    private const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';
    private const TOKEN_URL = 'https://oauth2.googleapis.com/token';

    public function __construct()
    {
        $this->client = new Client();
    }

    private function getAccessToken(int $userId): ?string
    {
        $googleUser = GoogleUserInfo::where('user_id', $userId)->first();

        if (!$googleUser) {
            return null;
        }

        if ($googleUser->token_expires_at && $googleUser->token_expires_at->isPast()) {
            $this->refreshAccessToken($googleUser);
            $googleUser->refresh();
        }

        return $googleUser->access_token;
    }

    private function refreshAccessToken(GoogleUserInfo $googleUser): void
    {
        if (!$googleUser->refresh_token) {
            Log::error('No refresh token available', ['user_id' => $googleUser->user_id]);
            return;
        }

        try {
            $response = $this->client->post(self::TOKEN_URL, [
                'form_params' => [
                    'client_id' => config('services.google.client_id'),
                    'client_secret' => config('services.google.client_secret'),
                    'refresh_token' => $googleUser->refresh_token,
                    'grant_type' => 'refresh_token',
                ],
            ]);

            $tokens = json_decode($response->getBody()->getContents(), true);

            $googleUser->update([
                'access_token' => $tokens['access_token'],
                'expires_in' => $tokens['expires_in'],
                'token_expires_at' => now()->addSeconds($tokens['expires_in']),
            ]);

            Log::info('Access token refreshed', ['user_id' => $googleUser->user_id]);
        } catch (\Exception $e) {
            Log::error('Failed to refresh token', [
                'user_id' => $googleUser->user_id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function extractSheetId(string $url): ?string
    {
        if (preg_match('/\/d\/([a-zA-Z0-9-_]+)/', $url, $matches)) {
            return $matches[1];
        }
        return null;
    }

    public function getSheetMetadata(string $sheetId, int $userId): ?array
    {
        $accessToken = $this->getAccessToken($userId);
        if (!$accessToken) {
            Log::error('GoogleSheetsService: No access token found', ['user_id' => $userId]);
            return null;
        }

        try {
            $response = $this->client->get(self::SHEETS_API_BASE . "/{$sheetId}", [
                'headers' => [
                    'Authorization' => "Bearer {$accessToken}",
                ],
            ]);

            return json_decode($response->getBody()->getContents(), true);
        } catch (\Exception $e) {
            Log::error('GoogleSheetsService: Failed to get sheet metadata', [
                'sheet_id' => $sheetId,
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'response' => $e instanceof \GuzzleHttp\Exception\RequestException && $e->hasResponse()
                    ? $e->getResponse()->getBody()->getContents()
                    : null
            ]);
            return null;
        }
    }

    public function appendToSheet(string $sheetId, string $range, array $values, int $userId): bool
    {
        $accessToken = $this->getAccessToken($userId);
        if (!$accessToken) {
            return false;
        }

        try {
            $this->client->post(self::SHEETS_API_BASE . "/{$sheetId}/values/{$range}:append", [
                'headers' => [
                    'Authorization' => "Bearer {$accessToken}",
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'values' => $values,
                    'valueInputOption' => 'RAW',
                ],
                'query' => [
                    'valueInputOption' => 'RAW',
                ],
            ]);

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function updateSheet(string $sheetId, string $range, array $values, int $userId): bool
    {
        $accessToken = $this->getAccessToken($userId);
        if (!$accessToken) {
            return false;
        }

        try {
            $this->client->put(self::SHEETS_API_BASE . "/{$sheetId}/values/{$range}", [
                'headers' => [
                    'Authorization' => "Bearer {$accessToken}",
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'values' => $values,
                ],
                'query' => [
                    'valueInputOption' => 'RAW',
                ],
            ]);

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function getSheetData(string $sheetId, string $range, int $userId): ?array
    {
        $accessToken = $this->getAccessToken($userId);
        if (!$accessToken) {
            return null;
        }

        try {
            $response = $this->client->get(self::SHEETS_API_BASE . "/{$sheetId}/values/{$range}", [
                'headers' => [
                    'Authorization' => "Bearer {$accessToken}",
                ],
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            return $data['values'] ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function clearSheet(string $sheetId, string $range, int $userId): bool
    {
        $accessToken = $this->getAccessToken($userId);
        if (!$accessToken) {
            return false;
        }

        try {
            $this->client->post(self::SHEETS_API_BASE . "/{$sheetId}/values/{$range}:clear", [
                'headers' => [
                    'Authorization' => "Bearer {$accessToken}",
                    'Content-Type' => 'application/json',
                ],
            ]);

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
