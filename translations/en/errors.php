<?php

return [
    /*
	|--------------------------------------------------------------------------
	| ERRORS
	|--------------------------------------------------------------------------
	|
	*/

    'bad_gateway' =>
        'The server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.',
    'bad_request' =>
        'The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).',
    'forbidden' => 'The server understood the request but refuses to authorize it.',
    'method_not_allowed' =>
        'The method received in the request-line is known by the origin server but not supported by the target resource.',
    'page_not_found' =>
        'The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.',
    'post_too_large' =>
        'The server is refusing to process a request because the request payload is larger than the server is willing or able to process.',
    'request_timeout' => 'The server did not receive a complete request message within the time that it was prepared to wait.',
    'server_error' => 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
    'service_unavailable' =>
        'The server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay.',
    'token_mismatch' => 'CSRF token mismatch.',
    'too_many_requests' => 'The user has sent too many requests in a given amount of time ("rate limiting").',
    'unauthorized' => 'Unauthenticated.',
    'validate' =>
        'The server understands the content type of the request entity (hence a 415 Unsupported Media Type status code is inappropriate), and the syntax of the request entity is correct (thus a 400 Bad Request status code is inappropriate) but was unable to process the contained instructions.',
];
