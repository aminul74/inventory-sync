<?php

namespace App\Lib\Queries;

class InventoryItem
{
    public static function INVENTORY_ITEM_ID_FROM_VARIANT(): string
    {
        return <<<'GRAPHQL'
        query getInventoryItemId($id: ID!) {
            productVariant(id: $id) {
                inventoryItem {
                    id
                }
            }
        }
        GRAPHQL;
    }
}
