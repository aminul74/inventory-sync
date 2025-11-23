<?php

namespace App\Services;

use App\Models\Settings;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class SettingsService
{
    /**
     * Update settings for the authenticated shop.
     *
     * @param array $settings
     * @return 
     */
    public function updateSettings(array $settings): JsonResponse
    {
        $shop = Auth::user()->name;
        $settingsModel = Settings::where('shop', $shop)->first();

        if ($settingsModel) {
            $settingsModel->settings = json_encode($settings);
            $settingsModel->save();
            return response()->json(['success' => true]);
        }
        else
        {
            Settings::create([
                'shop' => $shop,
                'settings' => json_encode($settings),
            ]);
        }

        return response()->json(['success' => true]);
    }
}   