<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\LocationService;
use App\Lib\ShopifyClient;
use Mockery;
use Illuminate\Support\Facades\Facade;
use ReflectionMethod;

class LocationServiceTest extends TestCase
{
    public function tearDown(): void
    {
        parent::tearDown();
        Mockery::close();
    }

    public function test_process_locations_data_returns_correct_structure()
    {
        $service = new LocationService();

        $locations = [
            [
                'node' => [
                    'id' => 'gid://shopify/Location/1',
                    'name' => 'Main Warehouse',
                    'address' => [
                        'address1' => '123 Street',
                        'city' => 'Dhaka',
                        'country' => 'Bangladesh',
                        'zip' => '1200',
                    ]
                ]
            ]
        ];

        $method = new ReflectionMethod(LocationService::class, 'processLocationsData');
        $method->setAccessible(true);

        $result = $method->invoke($service, $locations);

        $this->assertCount(1, $result);
        $this->assertEquals('Main Warehouse', $result[0]['name']);
        $this->assertEquals('Dhaka', $result[0]['address']['city']);
    }

    public function test_get_locations_returns_processed_data()
    {
        $mockedData = [
            'locations' => [
                'edges' => [
                    [
                        'node' => [
                            'id' => 'gid://shopify/Location/1',
                            'name' => 'Main Warehouse',
                            'address' => [
                                'address1' => '123 Street',
                                'city' => 'Dhaka',
                                'country' => 'Bangladesh',
                                'zip' => '1200',
                            ]
                        ]
                    ]
                ]
            ]
        ];

        Facade::setFacadeApplication(app());
        $mock = Mockery::mock('alias:' . ShopifyClient::class);
        $mock->shouldReceive('queryOrException')
             ->once()
             ->andReturn($mockedData);

        $service = new LocationService();
        $result = $service->getLocations();

        $this->assertCount(1, $result);
        $this->assertEquals('Main Warehouse', $result[0]['name']);
    }
}
