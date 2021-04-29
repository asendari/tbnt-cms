<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Token duration
    |--------------------------------------------------------------------------
    |
    | This value is the duration in minutes of the token.
    |
    | Default: 10
    |
    */

    'token_ttl' => env('OAUTH_TOKEN_TTL', 10),

    /*
    |--------------------------------------------------------------------------
    | Refresh token duration
    |--------------------------------------------------------------------------
    |
    | This value is the duration in minutes of the refresh token.
    |
    | Default: 60
    |
    */

    'refresh_token_ttl' => env('OAUTH_REFRESH_TOKEN_TTL', 60),

    /*
    |--------------------------------------------------------------------------
    | Grace period duration
    |--------------------------------------------------------------------------
    |
    | This value is the duration in minutes of the refresh token grace period.
    |
    | Default: 2
    |
    */

    'grace_period_ttl' => env('OAUTH_GRACE_PERIOD_TTL', 2),
];
