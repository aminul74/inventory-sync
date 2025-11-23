<?php

namespace App\Services;

use App\Exceptions\ShopifyApiException;
use App\Lib\Mutations\ProductVariants;
use App\Lib\Queries\InventoryItem;
use App\Lib\Queries\SingleShopifyProduct;
use App\Lib\ShopifyClient;
use LogHelper;

class SingleProductService
{
    public function __construct(private LocationService $locationService) {}

    public function getProduct($id)
    {
        try {
            $query = SingleShopifyProduct::SINGLE_PRODUCT_QUERY($id);
            $result = ShopifyClient::queryOrException($query);
            return $this->processSingleProductData($result['product']);
        } catch (ShopifyApiException $e) {
            LogHelper::logExceptionWithContext($e);
        }
    }

    public function updateProductVariants($variants)
    {
        try {
            $locations = $this->locationService->getLocations();
            $variantQuantityMutation = ProductVariants::INVENTORY_SET_QUANTITIES_MUTATION();

            $locationId = $this->getLocationId($locations);
            $quantityVariables = $this->getQuantityVariables($variants, $locationId);

            return ShopifyClient::queryOrException($variantQuantityMutation, $quantityVariables);
        } catch (ShopifyApiException $e) {
            LogHelper::logExceptionWithContext($e);
        }
    }

    private function processSingleProductData($product): array
    {
        $img = 'https://placehold.co/600x600';
        $altText = "Product Image";

        if (isset($product['media']['edges'][0]['node'])) {
            $img        = $product['media']['edges'][0]['node']['preview']['image']['originalSrc'];
            $altText    = $product['media']['edges'][0]['node']['preview']['image']['altText'];
        }

        $productData = [
            'title'                 => $product['title'],
            'status'                => $product['status'],
            'currency'              => $product['priceRangeV2']['maxVariantPrice']['currencyCode'],
            'variants'              => $this->processVariantsData($product['variants']),
            'image'                 => $img,
            'imgAlt'                => $altText,
            'hasOnlyDefaultVariant' => $product['hasOnlyDefaultVariant'],
            'hasOutOfStockVariants' => $product['hasOutOfStockVariants'],
            'locations'             => $this->locationService->getLocations(),
        ];

        return $productData;
    }

    private function processVariantsData($variantsArray): array
    {
        $img = 'https://placehold.co/600x600';
        $variants = [];

        foreach ($variantsArray['edges'] as $variant) {
            $variantData = [
                'id'           => $variant['node']['id'],
                'title'        => $variant['node']['title'],
                'displayName'  => $variant['node']['displayName'],
                'price'        => $variant['node']['price'],
                'quantity'     => $variant['node']['inventoryQuantity'],
                'image'        => isset($variant['node']['media']['edges'][0]['node']) ?
                    $variant['node']['media']['edges'][0]['node']['preview']['image']['originalSrc'] : $img,
            ];
            $variants[] = $variantData;
        }
        return $variants;
    }

    private function getLocationId($locations): string
    {
        $locationId = '';
        foreach ($locations as $location) {
            if ($location['name'] === 'Shop location') {
                $locationId = $location['id'];
                break;
            }
        }
        return $locationId;
    }

    private function getInventoryItemId($variant): string
    {
        $query = InventoryItem::INVENTORY_ITEM_ID_FROM_VARIANT();
        $variables = [
            'id' => $variant['id'],
        ];
        $response = ShopifyClient::queryOrException($query, $variables);
        return $response['productVariant']['inventoryItem']['id'];
    }

    private function getQuantityVariables(array $variants, string $locationId): array
    {
        return [
            "input" => [
                "reason"                => "correction",
                "name"                  => "available",
                "referenceDocumentUri"  => "https://www.coursera.org/articles/inventory-management",
                "ignoreCompareQuantity" => true,
                "quantities" => array_map(function ($variant) use ($locationId) {
                    return [
                        "inventoryItemId"   => $this->getInventoryItemId($variant),
                        "locationId"        => $locationId,
                        "quantity"          => $variant["quantity"],
                        "compareQuantity"   => 1
                    ];
                }, $variants),
            ]
        ];
    }
}
