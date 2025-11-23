<?php

namespace App\Lib;

use Gnikyt\BasicShopifyAPI\BasicShopifyAPI;
use Gnikyt\BasicShopifyAPI\Options;
use Gnikyt\BasicShopifyAPI\Session;

class StorefrontClient
{
    public static function queryOrException(string $query, string $shop, string $shopPassword): array
    {
        $options = new Options();
        $options->setType(true);
        $options->setVersion(env('SHOPIFY_API_VERSION'));
        $options->setApiPassword($shopPassword);

        $api = new BasicShopifyAPI($options);
        $api->setSession(new Session($shop));

        $result = $api->graph($query);

        return response()->json($result)->getData(true);
        return [];
    }
}
