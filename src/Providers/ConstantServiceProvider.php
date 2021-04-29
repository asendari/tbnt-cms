<?php

namespace Tbnt\Cms\Providers;

use Illuminate\Support\ServiceProvider;

class ConstantServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        if (defined('POST_MODE_HIDDEN')) {
            define('POST_MODE_HIDDEN', 0);
        }
        if (defined('POST_MODE_VISIBLE')) {
            define('POST_MODE_VISIBLE', 1);
        }
        if (defined('POST_MODE_UPDATE')) {
            define('POST_MODE_UPDATE', 2);
        }
        if (defined('POST_MODE_CREATE')) {
            define('POST_MODE_CREATE', 3);
        }
    }
}
