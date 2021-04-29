<?php

return [
    /*
	|--------------------------------------------------------------------------
	| MODULE DATES
	|
	| JS - https://date-fns.org/v2.8.1/docs/format
	| FP - https://flatpickr.js.org/formatting
	|--------------------------------------------------------------------------
    |
    | Custom
    |
	*/

    'js' => [
        'dd_M_D' => 'EEEE MM/dd', // Sunday 01/30
        'dd_M_D_h_m' => 'EEEE MM/dd hh:mm a', // Sunday 01/30 11:11 pm
        'dd_M_D_YY_h_m' => 'EEEE MM/dd yyyy hh:mm a', // Sunday 01/30 2019 11:11 pm
        'dd_MM_D_YY' => 'EEEE, MMMM dd yyyy', // Sunday, January 30 2019
        'dd_MM_D_YY_h_m' => 'EEEE, MMMM dd yyyy, hh:mm a', // Sunday, January 30 2019, 11:11 pm
        'M_D' => 'MM/dd', // 01/30
        'M_D_YY' => 'MM/dd/yyyy', // 01/30/2019
        'M_D_YY_th' => 'MM/dd/yyyy at HH:mm', // 01/30/2019 at 11:11 pm
        'M_D_YY_lth' => 'MM/dd/yyyy at hh:mm a', // 01/30/2019 at 11:11 pm
        'ddd' => 'EEEE', // Sunday
        'dd' => 'EEE', // Sun
        'd' => 'yyyy-MM-dd', // 2019-01-30
        'dt' => 'yyyy-MM-dd HH:mm:ss', // 2019-01-30 22:11:00
        'Z' => 'yyyy-MM-dd\'T\'HH:mm:ssZ', // 2019-01-30T22:11:00+02:00
        't' => 'HH:mm:ss', // 22:11:00
        'th' => 'HH:mm', // 22:11
        'lth' => 'hh:mm a', // 11:11 pm
    ],

    'fp' => [
        'lmd' => 'j F Y',
    ],
];
