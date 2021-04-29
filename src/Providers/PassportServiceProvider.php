<?php

namespace Tbnt\Cms\Providers;

use Illuminate\Contracts\Container\BindingResolutionException;
use Laravel\Passport\Passport;
use Laravel\Passport\PassportServiceProvider as ServiceProvider;
use League\OAuth2\Server\Grant\RefreshTokenGrant;
use Tbnt\Cms\OAuth\RefreshTokenRepository;

class PassportServiceProvider extends ServiceProvider
{
    /**
     * Create and configure a Refresh Token grant instance.
     *
     * @return RefreshTokenGrant
     * @throws BindingResolutionException
     */
    protected function makeRefreshTokenGrant()
    {
        $repository = $this->app->make(RefreshTokenRepository::class);

        return tap(new RefreshTokenGrant($repository), function ($grant) {
            $grant->setRefreshTokenTTL(Passport::refreshTokensExpireIn());
        });
    }
}
