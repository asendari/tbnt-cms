<?php

/*
|--------------------------------------------------------------------------
| Test Routes
|--------------------------------------------------------------------------
|
*/

Route::post('/test', 'TestController@test');

Route::post('/config', 'TestController@config');

Route::post('/backup', 'TestController@backup');

Route::post('/upload', 'TestController@upload');

Route::post('/make-url', 'TestController@makeUrl');

Route::post('/responses', 'TestController@responses');
