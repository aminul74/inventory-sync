<?php

namespace App\Lib\Mutations;

class ProductVariants
{
    public static function INVENTORY_SET_QUANTITIES_MUTATION(): string
    {
        return <<<'GRAPHQL'
        mutation InventorySetQuantities($input: InventorySetQuantitiesInput!) {
            inventorySetQuantities(input: $input) {
                inventoryAdjustmentGroup {
                    createdAt
                    reason
                    referenceDocumentUri
                    changes {
                      name
                      delta
                    }
                }
                userErrors {
                    field
                    message
                }
            }
        }
        GRAPHQL;
    }
}
