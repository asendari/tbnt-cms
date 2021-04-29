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
        'dd_M_D' => 'EEEE dd.MM', // Dimanche 30.01
        'dd_M_D_h_m' => 'EEEE dd.MM HH\'h\'mm', // Dimanche 30.01 22h11
        'dd_M_D_YY_h_m' => 'EEEE dd.MM yyyy HH\'h\'mm', // Dimanche 30.01 2019 22h11
        'dd_MM_D_YY' => 'EEEE dd MMMM yyyy', // Dimanche 30 janvier 2019
        'dd_MM_D_YY_h_m' => 'EEEE dd MMMM yyyy HH\'h\'mm', // Dimanche 30 janvier 2019 22h11
        'M_D' => 'dd.MM', // 30.01
        'M_D_YY' => 'dd.MM.yyyy', // 30.01.2019
        'M_D_YY_th' => 'dd.MM.yyyy à HH:mm', // 30.01.2019 à 22:11
        'M_D_YY_lth' => 'dd.MM.yyyy à HH\'h\'mm', // 30.01.2019 à 22h11
        'ddd' => 'EEEE', // Dimanche
        'dd' => 'EEE', // Dim
        'd' => 'yyyy-MM-dd', // 2019-01-30
        'dt' => 'yyyy-MM-dd HH:mm:ss', // 2019-01-30 22:11:00
        'Z' => 'yyyy-MM-dd\'T\'HH:mm:ssZ', // 2019-01-30T22:11:00+02:00
        't' => 'HH:mm:ss', // 22:11:00
        'th' => 'HH:mm', // 22:11
        'lth' => 'HH\'h\'mm', // 22h11
    ],

    'fp' => [
        'lmd' => 'j F Y',
    ],
];
