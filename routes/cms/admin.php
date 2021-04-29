<?php

/*
|--------------------------------------------------------------------------
| Config
|--------------------------------------------------------------------------
|
*/

// -> /cms/admin/config
Route::prefix('config')->group(function () {
    Route::post('/', 'ConfigController@get');
});

/*
|--------------------------------------------------------------------------
| Auth
|--------------------------------------------------------------------------
|
*/

// -> /cms/admin/auth
Route::prefix('auth')->group(function () {
    Route::post('/login', 'AuthController@login');
    Route::post('/refresh-token', 'AuthController@refreshToken');
});

/*
|--------------------------------------------------------------------------
| Logged In Routes
|--------------------------------------------------------------------------
|
*/

Route::middleware(['auth:passport', 'cms.admin.type', 'cms.backup'])->group(function () {
    /*
	|--------------------------------------------------------------------------
	| Auth
	|--------------------------------------------------------------------------
	|
	*/

    // -> /cms/admin/auth
    Route::prefix('auth')->group(function () {
        Route::post('/me', 'AuthController@me');
        Route::post('/logout', 'AuthController@logout');
    });

    /*
	|--------------------------------------------------------------------------
	| Posts
	|--------------------------------------------------------------------------
	|
	*/

    // -> /cms/admin/posts
    Route::prefix('posts')->group(function () {
        Route::post('/', 'PostController@list');

        // -> /cms/admin/posts/:postType
        Route::prefix('{postType}')->group(function () {
            Route::post('/', 'PostController@list');
            Route::post('/create', 'PostController@create');
        });

        // -> /cms/admin/posts/:postId
        Route::prefix('{postId}')->group(function () {
            Route::post('/', 'PostController@one');
            Route::post('/update', 'PostController@oneUpdate');
            Route::post('/active', 'PostController@oneActive');
            Route::post('/inactive', 'PostController@oneInactive');
            Route::post('/delete', 'PostController@oneDelete');

            // -> /cms/admin/posts/:postId/media
            Route::prefix('media')->group(function () {
                Route::post('/update', 'PostController@oneMediaUpdate');
            });
        });
    });

    /*
	|--------------------------------------------------------------------------
	| Posts Types
	|--------------------------------------------------------------------------
	|
	*/

    // -> /cms/admin/posts-types
    Route::prefix('posts-types')->group(function () {
        Route::post('/', 'PostTypeController@list');

        // -> /cms/admin/posts-types/:postTypeId
        Route::prefix('{postTypeId}')->group(function () {
            Route::post('/', 'PostTypeController@one');
        });

        // -> /cms/admin/posts-types/:postType
        Route::prefix('{postType}')->group(function () {
            Route::post('/', 'PostTypeController@one');
        });
    });

    /*
	|--------------------------------------------------------------------------
	| Contacts
	|--------------------------------------------------------------------------
	|
	*/

    // -> /cms/admin/contacts
    Route::prefix('contacts')->group(function () {
        Route::post('/', 'ContactController@list');
    });

    /*
	|--------------------------------------------------------------------------
	| Users
	|--------------------------------------------------------------------------
	|
	*/

    // -> /cms/admin/users
    Route::prefix('users')->group(function () {
        Route::post('/', 'UserController@list');
        Route::post('/create', 'UserController@create');

        // -> /cms/admin/users/:userId
        Route::prefix('{userId}')->group(function () {
            Route::post('/', 'UserController@one');
            Route::post('/update', 'UserController@oneUpdate');
            Route::post('/password/update', 'UserController@oneUpdatePassword');
            Route::post('/forgotten-password', 'UserController@oneForgottenPassword');
            Route::post('/active', 'UserController@oneActive');
            Route::post('/inactive', 'UserController@oneInactive');
            Route::post('/delete', 'UserController@oneDelete');
        });
    });

    /*
	|--------------------------------------------------------------------------
	| Countries
	|--------------------------------------------------------------------------
	|
	*/

    // -> /cms/admin/countries
    Route::prefix('countries')->group(function () {
        Route::post('/', 'CountryController@list');

        // -> /cms/admin/countries/:countryId
        Route::prefix('{countryId}')->group(function () {
            Route::post('/', 'CountryController@one');
            Route::post('/update', 'CountryController@oneUpdate');
            Route::post('/active', 'CountryController@oneActive');
            Route::post('/inactive', 'CountryController@oneInactive');
        });
    });

    /*
	|--------------------------------------------------------------------------
	| Superadmin Routes
	|--------------------------------------------------------------------------
	|
	*/

    Route::middleware(['cms.admin.superadmin'])->group(function () {
        /*
		|--------------------------------------------------------------------------
		| Posts Types
		|--------------------------------------------------------------------------
		|
		*/

        // -> /cms/admin/posts-types
        Route::prefix('posts-types')->group(function () {
            Route::post('/create', 'PostTypeController@create');

            // -> /cms/admin/posts-types/:postTypeId
            Route::prefix('{postTypeId}')->group(function () {
                Route::post('/update', 'PostTypeController@oneUpdate');
                Route::post('/active', 'PostTypeController@oneActive');
                Route::post('/inactive', 'PostTypeController@oneInactive');
                Route::post('/delete', 'PostTypeController@oneDelete');
            });
        });
    });
});
