<?php

/*
|--------------------------------------------------------------------------
| Docs
|--------------------------------------------------------------------------
|
*/

// -> /cms/web/api-docs
Route::prefix('api-docs')
    ->middleware(['cms.local'])
    ->group(function () {
        Route::get('/', 'DocsController@get');
    });

/*
|--------------------------------------------------------------------------
| Config
|--------------------------------------------------------------------------
|
*/

// -> /cms/web/config
Route::prefix('config')->group(function () {
    Route::post('/', 'ConfigController@get');
});

/*
|--------------------------------------------------------------------------
| Posts
|--------------------------------------------------------------------------
|
*/

// -> /cms/web/posts
Route::prefix('posts')->group(function () {
    Route::post('/list', 'PostController@list');
    Route::post('/find', 'PostController@find');

    // -> /cms/web/posts/:postId
    Route::prefix('{postId}')->group(function () {
        Route::post('/', 'PostController@one');
    });
});

/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
|
*/

if (config('cms.user') === true) {
    /*
	|--------------------------------------------------------------------------
	| Auth
	|--------------------------------------------------------------------------
	|
	*/

    // -> /cms/web/auth
    Route::prefix('auth')->group(function () {
        Route::post('/signin', 'AuthController@signin');
        Route::post('/login', 'AuthController@login');
        Route::post('/forgot-password', 'AuthController@forgot');
        Route::post('/recover-password', 'AuthController@recover');
        Route::get('/refresh-token', 'AuthController@refresh');
    });

    /*
	|--------------------------------------------------------------------------
	| Logged In Routes
	|--------------------------------------------------------------------------
	|
	*/

    Route::middleware(['auth:passport', 'cms.web.type'])->group(function () {
        /*
		|--------------------------------------------------------------------------
		| Auth
		|--------------------------------------------------------------------------
		|
		*/

        // -> /cms/web/auth
        Route::prefix('auth')->group(function () {
            Route::get('/me', 'AuthController@me');
            Route::get('/logout', 'AuthController@logout');
        });

        /*
		|--------------------------------------------------------------------------
		| User
		|--------------------------------------------------------------------------
		|
		*/

        // -> /cms/web/user
        Route::prefix('user')->group(function () {
            Route::post('/update', 'UserController@update');
        });
    });
}
