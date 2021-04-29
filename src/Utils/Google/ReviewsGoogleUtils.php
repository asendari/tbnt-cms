<?php

namespace Tbnt\Cms\Utils\Google;

use GuzzleHttp\Client as Guzzle;

class ReviewsGoogleUtils
{
    /**
     * Get reviews rating
     *
     * @param string $place_id Google Place ID
     * @return object|false
     */
    public static function getRating(string $place_id)
    {
        $url = 'https://maps.googleapis.com/maps/api/place/details/json';
        $data = [
            'query' => [
                'placeid' => $place_id,
                'fields' => 'name,rating,user_ratings_total',
                'key' => config('services.google.api.key'),
            ],
        ];

        $client = new Guzzle(['defaults' => ['exceptions' => false]]);

        $response = $client->get($url, $data);
        $response = json_decode($response->getBody());

        if ($response->status !== 'OK') {
            return false;
        }

        return $response->result;
    }
}
