<?php

/*
|--------------------------------------------------------------------------
| Cms Admin Routes
|--------------------------------------------------------------------------
|
*/

Route::prefix('admin')
    ->namespace('Admin')
    ->middleware(['cms.group.api.admin'])
    ->group(function () {
        require_once __DIR__ . '/cms/admin.php';
    });

/*
|--------------------------------------------------------------------------
| Cms Web Routes
|--------------------------------------------------------------------------
|
*/

Route::prefix('web')
    ->namespace('Web')
    ->middleware(['cms.group.api.web'])
    ->group(function () {
        require_once __DIR__ . '/cms/web.php';
    });
