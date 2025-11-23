<?php

namespace App\Lib;

use Illuminate\Support\Facades\Auth;
use App\Exceptions\ShopifyApiException;

class ShopifyClient
{
    public static function queryOrException(string $query, array $variables = []): array
    {
        $shopDetails = Auth::user();
        $response = $shopDetails->api()->graph($query, $variables);

        if ($response['status'] !== 200) {
            throw new ShopifyApiException(
                'HTTP Error: ' . $response['status'],
                [
                    'status' => $response['status'],
                    'response' => $response,
                ]
            );
        }

        if (!empty($response['body']->container['errors'])) {
            throw new ShopifyApiException(
                'GraphQL Error: ' . json_encode($response['body']->container['errors']),
                [
                    'errors' => $response['body']->container['errors'],
                    'response' => $response,
                ]
            );
        }

        if (empty($response['body']->container['data'])) {
            throw new ShopifyApiException(
                'Empty response from Shopify.',
                [
                    'response' => $response,
                ]
            );
        }

        return $response['body']->container['data'];
    }
}
