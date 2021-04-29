<?php

namespace Tbnt\Cms\Providers;

use Illuminate\Support\ServiceProvider;
use Intervention\Image\ImageServiceProvider;

class CmsServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->register(AuthServiceProvider::class);
        $this->app->register(PackageServiceProvider::class);
        $this->app->register(BladeServiceProvider::class);
        $this->app->register(ConstantServiceProvider::class);
        $this->app->register(MiddlewareServiceProvider::class);
        $this->app->register(ObserverServiceProvider::class);
        $this->app->register(PassportServiceProvider::class);
        $this->app->register(RouteServiceProvider::class);
        $this->app->register(ValidatorServiceProvider::class);
        $this->app->register(ImageServiceProvider::class);
    }
}
