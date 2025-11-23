<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;

class ShopHelper
{
    /**
     * Sanitize the shop domain.
     *
     * @param string $shop The shop domain to sanitize.
     * @param string|null $myshopifyDomain The myshopify domain to use for validation.
     * @return string|null The sanitized shop domain or null if invalid.
     */
    public static function sanitizeShopDomain(string $shop, ?string $myshopifyDomain = null): ?string
    {
        $name = trim(strtolower($shop));
        $CUSTOM_SHOP_DOMAINS = null;

        if ($myshopifyDomain) {
            $allowedDomains = [preg_replace("/^\*?\.?(.*)/", "$1", $myshopifyDomain)];
        } else {
            $allowedDomains = ["myshopify.com", "myshopify.io"];
        }

        if ($CUSTOM_SHOP_DOMAINS) {
            $allowedDomains = array_merge(
                $allowedDomains,
                preg_replace("/^\*?\.?(.*)/", "$1", $CUSTOM_SHOP_DOMAINS)
            );
        }

        $allowedDomainsRegexp = "(" . implode("|", $allowedDomains) . ")";

        if (!preg_match($allowedDomainsRegexp, $name) && (strpos($name, ".") === false)) {
            $name .= '.' . ($myshopifyDomain ?? 'myshopify.com');
        }
        $name = preg_replace("/\A(https?\:\/\/)/", '', $name);

        if (preg_match("/\A[a-zA-Z0-9][a-zA-Z0-9\-]*\.{$allowedDomainsRegexp}\z/", (string) $name)) {
            return $name;
        } else {
            return null;
        }
    }

    /**
     * Check if the shop is using the app or not.
     *
     * @param string $shop The shop domain to check.
     * @return string|null The sanitized shop domain or null if not found.
     */

    public static function checkShopUsingAppOrNot($shop): ?object
    {
        $shop = self::sanitizeShopDomain($shop);
        $shopData = DB::table('users')
            ->select('name', 'password')
            ->where('name', $shop)
            ->first();

        if ($shopData) {
            return $shopData;
        } else {
            return null;
        }
    }
}
