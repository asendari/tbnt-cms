<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Global "From" Address
    |--------------------------------------------------------------------------
    |
    | You may wish for all e-mails sent by your application to be sent from
    | the same address. Here, you may specify a name and address that is
    | used globally for all e-mails that are sent by your application.
    |
    */

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
        'name' => env('MAIL_FROM_NAME', app_name() ?: 'Example'),
    ],

    /*
	|--------------------------------------------------------------------------
	| Global "Reply To" Address
	|--------------------------------------------------------------------------
	|
	| You may wish for all e-mails sent by your application to be sent from
	| the same address. Here, you may specify a name and address that is
	| used globally for all e-mails that are sent by your application.
	|
	*/

    'reply_to' => [
        'address' => env('MAIL_REPLY_TO_ADDRESS', 'hello@example.com'),
        'name' => env('MAIL_REPLY_TO_NAME', app_name() ?: 'Example'),
    ],

    /*
	|--------------------------------------------------------------------------
	| Default "To" Address
	|--------------------------------------------------------------------------
	|
	| You may wish for all e-mails sent by your application to be sent to
	| the same address. Here, you may specify an address that is
	| used globally for all e-mails that are sent by your application.
	|
	*/

    'default_to' => [
        'address' => env('MAIL_DEFAULT_TO_ADDRESS', 'hello@example.com'),
        'name' => env('MAIL_DEFAULT_TO_NAME', app_name() ?: 'Example'),
    ],
];
