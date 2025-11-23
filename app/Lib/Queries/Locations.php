<?php

namespace App\Lib\Queries;

class Locations
{
    public static function LOCATIONS_QUERY()
    {
        $query = '{
            locations(first: 10) {
                edges {
                    node {
                        id
                        name
                        address {
                            address1
                            city
                            country
                            zip
                        }
                    }
                }
            }
        }';

        return $query;
    }
}