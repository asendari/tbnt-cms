<?php

namespace Tbnt\Cms\Utils;

use GuzzleHttp\Client as Guzzle;

class FacebookUtils
{
    /**
     * Trigger facebook share
     *
     * @param string $url
     * @return object
     */
    public static function triggerShare(string $url)
    {
        $client = new Guzzle(['defaults' => ['exceptions' => false]]);

        $response = $client->get('https://graph.facebook.com', [
            'query' => ['scrape' => true, 'id' => urlencode($url)],
        ]);

        $response = json_decode($response->getBody());

        return $response;
    }
}
