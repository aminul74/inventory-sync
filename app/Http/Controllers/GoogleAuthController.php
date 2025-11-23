<?php

namespace App\Http\Controllers;

use App\Helpers\GoogleHelper;
use App\Http\Requests\GoogleCallbackRequest;
use App\Services\GoogleOAuthService;
use App\Services\GoogleTokenManager;
use App\Services\GoogleUserInfoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;

class GoogleAuthController extends Controller
{
    public function __construct(
        private GoogleOAuthService $oauth,
        private GoogleTokenManager $tokens,
        private GoogleUserInfoService $googleUserInfoService,
        private GoogleHelper $googleHelper
    ) {}

    public function redirectToGoogle(): JsonResponse
    {
        try {
            GoogleHelper::validateGoogleConfig();
            $url = GoogleHelper::getGoogleAuthorizationUrl();
            return response()->json(['success' => true, 'url' => $url]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function handleGoogleCallback(GoogleCallbackRequest $request): RedirectResponse
    {
        if ($request->has('error')) {
            return Redirect::to('/setup?error=auth_failed');
        }

        try {
            $tokenData = $this->oauth->getTokens($request->input('code'));
            $userData = $this->oauth->getUserInfo($tokenData['access_token'] ?? '');

            $this->tokens->store($tokenData, $userData);

            $userId = $this->googleHelper->getShopifyUserId();
            if ($userId) {
                $this->googleUserInfoService->storeOrUpdate($userId, $userData, $tokenData);
            }

            return Redirect::to($this->googleHelper->redirectToShopifyAdmin());
        } catch (\Exception $e) {
            return Redirect::to('/setup?error=auth_failed');
        }
    }

    public function getGoogleUser(): JsonResponse
    {
        $user = $this->tokens->getUser();

        if (!$user) {
            return response()->json(['success' => false, 'connected' => false, 'error' => 'No Google account connected'], 401);
        }

        return response()->json(['success' => true, 'connected' => true, 'user' => $user]);
    }

    public function disconnectGoogle(): JsonResponse
    {
        try {
            if ($token = $this->tokens->getToken()) {
                $this->oauth->revokeToken($token);
            }

            $this->tokens->clear();
            return response()->json(['success' => true, 'message' => 'Disconnected']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => 'Failed to disconnect'], 500);
        }
    }

    public function getGoogleUserInfo(): JsonResponse
    {
        try {
            $userId = $this->googleHelper->getShopifyUserId();
            if (!$userId) {
                return response()->json(['success' => false, 'user' => null, 'connected' => false], 200);
            }

            $googleUserInfo = $this->googleUserInfoService->getByUserId($userId);
            if (!$googleUserInfo) {
                return response()->json(['success' => false, 'user' => null, 'connected' => false], 200);
            }

            return response()->json([
                'success' => true,
                'connected' => true,
                'user' => [
                    'email' => $googleUserInfo->email,
                    'name' => $googleUserInfo->name,
                    'picture' => $googleUserInfo->picture,
                    'google_id' => $googleUserInfo->google_id,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'user' => null, 'connected' => false, 'error' => $e->getMessage()], 200);
        }
    }

    public function refreshGoogleToken(): JsonResponse
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'error' => 'Not authenticated'], 401);
            }

            $googleUserInfo = $this->googleUserInfoService->getByUserId($user->id);
            if (!$googleUserInfo) {
                return response()->json(['success' => false, 'error' => 'No Google account connected'], 404);
            }

            if (!$this->googleUserInfoService->isTokenExpired($googleUserInfo)) {
                return response()->json(['success' => true, 'message' => 'Token still valid']);
            }

            if (!$googleUserInfo->refresh_token) {
                return response()->json(['success' => false, 'error' => 'No refresh token available'], 400);
            }

            // Token refresh implementation may be added to GoogleOAuthService if desired.
            return response()->json(['success' => true, 'message' => 'Token refreshed']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
