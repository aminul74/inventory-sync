<?php

namespace App\Services;

use App\Exceptions\ShopifyApiException;
use App\Lib\Queries\ShopifyProducts;
use App\Lib\ShopifyClient;
use Illuminate\Support\Facades\Log;
use LogHelper;

class ProductsService
{
    public function getProducts($before, $after)
    {
        try {
            $paginationPart = $this->getPaginationPart($before, $after);
            $query = ShopifyProducts::PRODUCTS_QUERY($paginationPart);
            $result = ShopifyClient::queryOrException($query);
            $processedProducts = $this->processProductsData($result['products']['edges']);
            $productsData = [];
            $productsData['products'] = $processedProducts;
            $productsData['pageInfo'] = $result['products']['pageInfo'];
            return $productsData;
        } catch (ShopifyApiException $e) {
            LogHelper::logExceptionWithContext($e);
        }
    }

    private function getPaginationPart($before, $after) : string
    {
        if ($after) {
            return 'first: 5, after: "' . $after . '"';
        } elseif ($before) {
            return 'last: 5, before: "' . $before . '"';
        } else {
            return 'first: 5';
        }
    }

    private function processProductsData($productsArray) : array
    {
        $products = [];
        foreach ($productsArray as $product) {
            $img = 'https://placehold.co/600x600';
            $altText = "Product Image";
            
            if(isset($product['node']['media']['edges'][0]['node'])) {
                $img        = $product['node']['media']['edges'][0]['node']['preview']['image']['url'];
                $altText    = $product['node']['media']['edges'][0]['node']['preview']['image']['altText'];
            }

            $productData = [
                'id'        => $product['node']['id'],
                'title'     => $product['node']['title'],
                'status'    => $product['node']['status'],
                'minPrice'  => $product['node']['priceRangeV2']['minVariantPrice']['amount'],
                'maxPrice'  => $product['node']['priceRangeV2']['maxVariantPrice']['amount'],
                'currency'  => $product['node']['priceRangeV2']['maxVariantPrice']['currencyCode'], 
                'quantity'  => $this->getTotalQuantity($product['node']['variants']['edges']),
                'image'     => $img,
                'imgAlt'    => $altText,
                'cursor'   => $product['cursor']
            ];

            $products[] = $productData;
        }
        return $products;
    }

    private function getTotalQuantity($variants) : int
    {
        $totalQuantity = 0;
        foreach ($variants as $variant) {
            $totalQuantity += $variant['node']['inventoryQuantity'];
        }
        return $totalQuantity;
    }
}
