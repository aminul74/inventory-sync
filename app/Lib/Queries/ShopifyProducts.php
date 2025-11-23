<?php

namespace App\Lib\Queries;

class ShopifyProducts
{
    public static function PRODUCTS_QUERY($paginationPart)
    {
        $query = '{
            products(' . $paginationPart . ') {
                edges {
                    node {
                        id
                        title
                        handle
                        status
                        priceRangeV2 {
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                            maxVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                        variants (first: 10) {
                            edges {
                                node {
                                    inventoryQuantity
                                }
                            }
                        }
                        media(first: 1) {
                            edges {
                                node {
                                    preview {
                                        image {
                                            url
                                            altText
                                        }
                                    }
                                }
                            }
                        }
                    }
                    cursor
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                }
            }
        }';

        return $query;
    }
}
