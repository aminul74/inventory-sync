<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\ProductsService;
use ReflectionMethod;

class ProductsServiceTest extends TestCase
{
    public function test_get_pagination_part_returns_correct_string()
    {
        $service = new ProductsService();

        $method = new ReflectionMethod(ProductsService::class, 'getPaginationPart');
        $method->setAccessible(true);

        $this->assertEquals('first: 5, after: "abc123"', $method->invoke($service, null, 'abc123'));
        $this->assertEquals('last: 5, before: "xyz456"', $method->invoke($service, 'xyz456', null));
        $this->assertEquals('first: 5', $method->invoke($service, null, null));
    }

    public function test_get_total_quantity_returns_sum()
    {
        $service = new ProductsService();

        $method = new ReflectionMethod(ProductsService::class, 'getTotalQuantity');
        $method->setAccessible(true);

        $variants = [
            ['node' => ['inventoryQuantity' => 10]],
            ['node' => ['inventoryQuantity' => 5]],
            ['node' => ['inventoryQuantity' => 3]]
        ];

        $total = $method->invoke($service, $variants);

        $this->assertEquals(18, $total);
    }

    public function test_process_products_data_returns_correct_structure()
    {
        $service = new ProductsService();

        $method = new ReflectionMethod(ProductsService::class, 'processProductsData');
        $method->setAccessible(true);

        $mockProducts = [
            [
                'cursor' => 'cursor1',
                'node' => [
                    'id' => 'gid://shopify/Product/9914130825489',
                    'title' => 'Test Product',
                    'status' => 'ACTIVE',
                    'priceRangeV2' => [
                        'minVariantPrice' => ['amount' => '10.00'],
                        'maxVariantPrice' => ['amount' => '20.00', 'currencyCode' => 'USD']
                    ],
                    'variants' => [
                        'edges' => [
                            ['node' => ['inventoryQuantity' => 5]],
                            ['node' => ['inventoryQuantity' => 10]]
                        ]
                    ],
                    'media' => [
                        'edges' => [
                            [
                                'node' => [
                                    'preview' => [
                                        'image' => [
                                            'url' => 'https://example.com/image.jpg',
                                            'altText' => 'Test Image'
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $processed = $method->invoke($service, $mockProducts);

        $this->assertIsArray($processed);
        $this->assertCount(1, $processed);
        $this->assertEquals('Test Product', $processed[0]['title']);
        $this->assertEquals(15, $processed[0]['quantity']);
        $this->assertEquals('https://example.com/image.jpg', $processed[0]['image']);
    }
}
