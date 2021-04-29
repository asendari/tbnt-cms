<?php

namespace Tbnt\Cms\OAuth;

use Laravel\Passport\Bridge\RefreshTokenRepository as Repository;
use Laravel\Passport\Passport;

class RefreshTokenRepository extends Repository
{
    /**
     * Revokes the refresh token.
     *
     * @param string $id
     * @return mixed
     */
    public function revokeRefreshToken($id)
    {
        return Passport::refreshToken()
            ->where('id', $id)
            ->update([
                'revoked' => false,
                'expires_at' => now()->addMinutes(config('cmsoauth.grace_period_ttl')),
            ]);
    }
}
