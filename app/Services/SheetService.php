<?php

namespace App\Services;

use App\Models\GoogleSheet;
use App\Models\GoogleSheetProperty;
use Illuminate\Support\Facades\Auth;

class SheetService
{
    public function __construct(
        private GoogleSheetsService $googleSheetsService
    ) {}

    public function createSheet(string $url, string $title, string $option): array
    {
        $user = Auth::user();

        if (!$user) {
            return ['success' => false, 'error' => 'User not authenticated'];
        }

        $googleUser = $user->googleUserInfo;
        if (!$googleUser || !$googleUser->access_token) {
            return ['success' => false, 'error' => 'Google account not connected or token missing'];
        }

        $sheetId = $this->googleSheetsService->extractSheetId($url);

        if (!$sheetId) {
            return ['success' => false, 'error' => 'Invalid sheet URL'];
        }

        $metadata = $this->googleSheetsService->getSheetMetadata($sheetId, $user->id);
        if (!$metadata) {
            return ['success' => false, 'error' => 'Could not access sheet. Please check: 1) Sheet URL is correct, 2) Sheet is shared with your Google account, 3) Token has not expired'];
        }

        $sheet = GoogleSheet::updateOrCreate(
            ['user_id' => $user->id, 'type' => 'Products'],
            [
                'url' => $url,
                'sheet_id' => $sheetId,
                'sheet_created_by' => $option === 'manual' ? 'user' : 'system',
                'sync_at' => now(),
            ]
        );

        if (!empty($metadata['sheets'])) {
            $sheetProperties = $metadata['sheets'][0]['properties'] ?? null;
            if ($sheetProperties) {
                GoogleSheetProperty::updateOrCreate(
                    ['google_sheet_id' => $sheet->id],
                    [
                        'properties' => [
                            'id' => $sheetProperties['sheetId'] ?? null,
                            'title' => $sheetProperties['title'] ?? $title,
                        ],
                    ]
                );
            }
        }

        return [
            'success' => true,
            'data' => [
                'spreadsheet' => $sheet->fresh(),
                'message' => 'Spreadsheet created',
            ],
        ];
    }

    public function getProfile(): array
    {
        $user = Auth::user();
        $googleUser = $user->googleUserInfo;
        $sheet = GoogleSheet::with('properties')->where('user_id', $user->id)->first();

        $profile = [
            'id' => $user->id,
            'shop' => $user->name,
            'shop_email' => $user->email,
            'google_profile' => null,
            'sheet' => null,
        ];

        if ($googleUser) {
            $profile['google_profile'] = [
                'user_id' => $googleUser->user_id,
                'provider' => 'google',
                'email' => $googleUser->email,
                'name' => $googleUser->name,
                'verified' => $googleUser->verified_email ? 1 : 0,
            ];
        }

        if ($sheet) {
            $profile['sheet'] = [
                'id' => $sheet->id,
                'user_id' => $sheet->user_id,
                'url' => $sheet->url,
                'type' => $sheet->type,
                'sheet_id' => $sheet->sheet_id,
                'meta' => $sheet->meta,
                'sync_at' => $sheet->sync_at ? $sheet->sync_at->diffForHumans() : null,
                'properties' => $sheet->properties ? [
                    'id' => $sheet->properties->id,
                    'google_sheet_id' => $sheet->properties->google_sheet_id,
                    'properties' => $sheet->properties->properties,
                    'created_at' => $sheet->properties->created_at,
                    'updated_at' => $sheet->properties->updated_at,
                ] : null,
                'updated_at' => $sheet->updated_at,
                'created_at' => $sheet->created_at,
            ];
        }

        return [
            'success' => true,
            'data' => ['profile' => $profile],
        ];
    }
}
