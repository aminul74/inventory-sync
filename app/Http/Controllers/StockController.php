<?php

namespace App\Http\Controllers;

use App\Exceptions\ShopifyApiException;
use App\Lib\Queries\SingleProductInventory;
use App\Lib\Queries\SingleShopifyProduct;
use App\Lib\ShopifyClient;
use App\Lib\StorefrontClient;
use Illuminate\Http\Request;
use LogHelper;
use ShopHelper;

class StockController extends Controller
{
    public function getProductStock(Request $request, $productId)
    {
        $shop = $request->get('shop');
        $user = ShopHelper::checkShopUsingAppOrNot($shop);
        
        if(!$user) {
            return response()->json(['error' => 'Shop not found.'], 404);
        }
        else
        {
            try {
                $query = SingleProductInventory::SINGLE_PRODUCT_INVENTORY_QUERY($productId);
                $result = StorefrontClient::queryOrException($query, $user->name, $user->password);
                if (empty($result)) {
                    return response()->json(['error' => 'Product not found.'], 404);
                }
                return response()->json($this->formatInventoryResponse($result));
            } catch(ShopifyApiException $e) {
                LogHelper::logExceptionWithContext($e);
            }
        }
    }

    private function formatInventoryResponse($result)
    {
        $product = $result['body']['data']['product'];
        $formattedResponse = [
            'title'                 => $product['title'],
            'hasOnlyDefaultVariant' => $product['hasOnlyDefaultVariant'],
            'hasOutOfStockVariants' => $product['hasOutOfStockVariants'],
            'status'                => $product['status'],
            'totalInventory'        => $product['totalInventory'],
        ];

        return $formattedResponse;
    }
}
