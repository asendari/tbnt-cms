<?php

namespace Tbnt\Cms\Utils\Google;

use GuzzleHttp\Client as Guzzle;

class AddressGoogleUtils
{
    /**
     * Get latlng from address
     *
     * @param string|array $address Address to geocode
     * @return object|false
     */
    public static function geocode($address)
    {
        $address = self::formatAdddress($address);

        // Geocode
        $url = 'https://maps.google.com/maps/api/geocode/json';
        $data = ['query' => ['sensor' => false, 'address' => urlencode($address)]];

        $client = new Guzzle(['defaults' => ['exceptions' => false]]);

        $response = $client->get($url, $data);
        $response = json_decode($response->getBody());

        // Check status
        if ($response->status !== 'OK') {
            return false;
        }

        // Get lat lng
        $geocode_result = $response->results[0];

        $lat = $geocode_result->geometry->location->lat;
        $lng = $geocode_result->geometry->location->lng;

        $formatted_address = $geocode_result->formatted_address;
        $address_components = self::component($geocode_result->address_components);

        if (($lat && $lng && $formatted_address) === false) {
            return false;
        }

        return array_to_object([
            'lat' => $lat,
            'lng' => $lng,
            'address' => $formatted_address,
            'components' => $address_components,
        ]);
    }

    /**
     * Get latlng from address
     *
     * @param string|array $address Address to geocode
     * @return object|false
     */
    public static function autocomplete($address)
    {
        $address = self::formatAdddress($address);

        // Autocomplete
        $url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
        $data = ['query' => ['sensor' => false, 'input' => urlencode($address), 'types' => 'address']];

        $client = new Guzzle(['defaults' => ['exceptions' => false]]);
        $response = $client->get($url, $data);

        $response = json_decode($response->getBody());

        // Check status
        if ($response->status !== 'OK') {
            return false;
        }

        return $response;
    }

    /**
     * Format components address
     *
     * @param array $components Components to format
     * @return object
     */
    private static function component(array $components)
    {
        $address_components = array_to_object(['street' => '', 'zip' => '', 'city' => '', 'country' => '']);

        array_map(function ($value) use (&$address_components) {
            if (in_array('street_number', $value->types)) {
                $address_components->street = trim($address_components->street) . ' ' . trim($value->long_name);
            }
            if (in_array('route', $value->types)) {
                $address_components->street = trim($value->long_name) . ' ' . trim($address_components->street);
            }
            if (in_array('postal_code', $value->types)) {
                $address_components->zip = trim($value->long_name);
            }
            if (in_array('locality', $value->types)) {
                $address_components->city = trim($value->long_name);
            }
            if (in_array('country', $value->types)) {
                $address_components->country = trim($value->long_name);
            }
        }, $components);

        return $address_components;
    }

    /**
     * Format address
     *
     * @param string|array $address Address to geocode
     * @return string
     */
    private static function formatAdddress($address)
    {
        if (is_array($address) === true) {
            if (in_array(false, [isset($address['street']), isset($address['zip']), isset($address['city'])]) === false) {
                $address = $address['street'] . ', ' . $address['zip'] . ' ' . $address['city'];
            } elseif (in_array(false, [isset($address[0]), isset($address[1]), isset($address[2])]) === false) {
                $address = $address[0] . ', ' . $address[1] . ' ' . $address[2];
            }
        }

        return remove_accents($address);
    }
}
