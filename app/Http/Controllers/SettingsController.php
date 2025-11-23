<?php

namespace App\Http\Controllers;

use App\Models\Settings;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use ShopHelper;

class SettingsController extends Controller
{
    public function __construct(private SettingsService $settingsService) {}

    public function getSettings()
    {
        $shop = Auth::user();
        $settings = Settings::where('shop', $shop->name)->first();

        if ($settings && $settings->settings) {
            return response()->json(json_decode($settings->settings, true));
        }

        return response()->json((object)[]);
    }

    public function getSettingsForStorefront(Request $request)
    {
        $shop = $request->get('shop');
        $user = ShopHelper::checkShopUsingAppOrNot($shop);

        if (!$user) return response()->json(['error' => 'Shop not found.'], 404);
        else 
        {
            $settings = Settings::where('shop', $user->name)->first();

            if ($settings && $settings->settings) {
                return response()->json(json_decode($settings->settings, true));
            }

            return response()->json((object)[]);
        }
    }

    public function updateSettings(Request $request)
    {
        $settings = $request->input('settings');
        return $this->settingsService->updateSettings($settings);
    }
}
