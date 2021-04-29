<?php

/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
|
*/

Route::get('/', 'HomeController@getPage');
Route::get('/{path?}', 'HomeController@getPage');
Route::get('/{langCode}/{path?}', 'HomeController@getPage');
