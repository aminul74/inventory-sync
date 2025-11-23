<?php

namespace App\Lib\Queries;

class SingleShopifyProduct
{
    public static function SINGLE_PRODUCT_QUERY($productId)
    {
        $productId = 'gid://shopify/Product/' . $productId;
        $productId = '"' . $productId . '"';
        $query = '{
            product(id: ' . $productId . ') {
                title
                hasOnlyDefaultVariant
                hasOutOfStockVariants
                priceRangeV2 {
                    maxVariantPrice {
                        currencyCode
                    }
                }
                media(first: 1) {
                    edges {
                        node {
                            preview {
                                image {
                                    originalSrc
                                    altText
                                }
                            }
                        }
                    }
                }
                status
                variants(first: 100) {
                    edges {
                        node {
                            id
                            title
                            price
                            inventoryQuantity
                            displayName
                            selectedOptions {
                                name
                                value
                            }
                            media(first: 100) {
                                edges {
                                    node {
                                        preview {
                                            image {
                                                originalSrc
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }';

        return $query;
    }
}
