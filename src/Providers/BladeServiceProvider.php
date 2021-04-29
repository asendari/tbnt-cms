<?php

namespace Tbnt\Cms\Providers;

use Blade;
use Illuminate\Support\ServiceProvider;

class BladeServiceProvider extends ServiceProvider
{
    /**
     * Register bindings in the container.
     *
     * @return void
     */
    public function boot()
    {
        Blade::directive('define', function ($expression) {
            return '<?php ' . rtrim($expression, ';') . '; ?>';
        });
    }
}
