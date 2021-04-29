<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Session Cookie Path
    |--------------------------------------------------------------------------
    |
    | The session cookie path determines the path for which the cookie will
    | be regarded as available. Typically, this will be the root path of
    | your application but you are free to change this when necessary.
    |
    */

    'path' => env('SESSION_PATH_COOKIE', base_url()),

    /*
	|--------------------------------------------------------------------------
	| HTTP Access Only
	|--------------------------------------------------------------------------
	|
	| Setting this value to true will prevent JavaScript from accessing the
	| value of the cookie and the cookie will only be accessible through
	| the HTTP protocol. You are free to modify this option if needed.
	|
	*/

    'http_only' => env('SESSION_HTTP_ONLY_COOKIE', true),

    /*
    |--------------------------------------------------------------------------
    | Same-Site Cookies
    |--------------------------------------------------------------------------
    |
    | This option determines how your cookies behave when cross-site requests
    | take place, and can be used to mitigate CSRF attacks. By default, we
    | do not enable this as other CSRF protection services are in place.
    |
    | Supported: "lax", "strict"
    |
    */

    'same_site' => env('SESSION_SAME_SITE_COOKIE', null),
];
