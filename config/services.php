<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'google' => [
        'api' => [
            'key' => env('GOOGLE_API_KEY', null),
            'signing' => env('GOOGLE_API_SIGNING', null),
            'secret' => env('GOOGLE_API_SECRET', null),
        ],
        'recaptcha' => [
            'key' => env('GOOGLE_RECAPTCHA_KEY', null),
            'secret' => env('GOOGLE_RECAPTCHA_SECRET', null),
        ],
        'analytics' => [
            'id' => env('GOOGLE_ANALYTICS_ID', null),
        ],
        'tag_manager' => [
            'id' => env('GOOGLE_TAG_MANAGER_ID', null),
        ],
        'service_accounts' => [
            'key' => env('GOOGLE_SERVICE_ACCOUNT_KEY', null),
            'read_only' => to_bool(env('GOOGLE_SERVICE_READONLY', null)),
            'asserted_user' => env('GOOGLE_SERVICE_ASSERTED_USER', null),
        ],
    ],

    'facebook' => [
        'pixel' => [
            'id' => env('FACEBOOK_PIXEL_ID', null),
        ],
    ],
];
