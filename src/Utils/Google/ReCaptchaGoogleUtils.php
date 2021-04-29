<?php

namespace Tbnt\Cms\Utils\Google;

use GuzzleHttp\Client as Guzzle;

class ReCaptchaGoogleUtils
{
    /**
     * Verify recaptcha challenge
     *
     * @param mixed $challenge Recaptcha challenge
     * @return bool
     */
    public static function verify($challenge)
    {
        $url = 'https://www.google.com/recaptcha/api/siteverify';
        $data = [
            'query' => [
                'response' => $challenge,
                'secret' => config('services.google.recaptcha.secret'),
                'remoteip' => $_SERVER['REMOTE_ADDR'],
            ],
        ];

        $client = new Guzzle(['defaults' => ['exceptions' => false]]);

        $response = $client->get($url, $data);
        $response = json_decode($response->getBody());

        return $response->success ?? false;
    }
}
