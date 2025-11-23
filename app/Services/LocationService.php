<?php

namespace App\Services;

use App\Exceptions\ShopifyApiException;
use App\Lib\Queries\Locations;
use App\Lib\ShopifyClient;
use Illuminate\Support\Facades\Log;
use LogHelper;

class LocationService
{
    public function getLocations()
    {
        try {
            $query = Locations::LOCATIONS_QUERY();
            $result = ShopifyClient::queryOrException($query);
            return $this->processLocationsData($result['locations']['edges']);
        } catch (ShopifyApiException $e) {
            LogHelper::logExceptionWithContext($e);
        }
    }

    private function processLocationsData($locations) : array
    {
        $processedLocations = [];
        foreach ($locations as $location) {
            $processedLocations[] = [
                'id' => $location['node']['id'],
                'name' => $location['node']['name'],
                'address' => [
                    'address1' => $location['node']['address']['address1'],
                    'city' => $location['node']['address']['city'],
                    'country' => $location['node']['address']['country'],
                    'zip' => $location['node']['address']['zip'],
                ],
            ];
        }
        return $processedLocations;
    }
}
