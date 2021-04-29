<?php

namespace Tbnt\Cms\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        Passport::routes(function ($router) {
            $router->forAccessTokens();
            $router->forTransientTokens();
        });

        Passport::tokensExpireIn(now()->addMinutes(config('cmsoauth.token_ttl')));
        Passport::refreshTokensExpireIn(now()->addMinutes(config('cmsoauth.refresh_token_ttl')));
    }
}
