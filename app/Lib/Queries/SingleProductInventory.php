<?php

namespace App\Lib\Queries;

class SingleProductInventory
{
    public static function SINGLE_PRODUCT_INVENTORY_QUERY($productId)
    {
        $productId = 'gid://shopify/Product/' . $productId;
        $productId = '"' . $productId . '"';
        $query = '{
            product(id: ' . $productId . ') {
                title
                hasOnlyDefaultVariant
                hasOutOfStockVariants
                status
                totalInventory
            }
        }';

        return $query;
    }
}
