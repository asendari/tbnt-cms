<?php

namespace Tbnt\Cms\Http\Controllers\Api;

use DB;
use Exception;
use GuzzleHttp\Client as Guzzle;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Laravel\Passport\Passport;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\Token;
use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Model\User;

class AuthController extends BaseController
{
    /**
     * Refresh token
     *
     * @var string
     */
    const REFRESH_TOKEN = null;

    /**
     * Logout
     *
     * @return void
     */
    public function logout()
    {
        $user = auth()->user();

        // Revoke access token
        $access_token = $user->token();
        $access_token->revoke();

        // Revoke refresh token
        DB::table('oauth_refresh_tokens')
            ->where('access_token_id', $access_token->id)
            ->update(['revoked' => true]);

        $this->removeRefreshToken();
    }

    /**
     * Refresh token
     *
     * @param Request $request
     * @return string
     */
    public function refreshToken(Request $request)
    {
        try {
            return $this->proxyOAuth('refresh_token', [
                'refresh_token' => (string) $this->getRefreshToken($request),
            ]);
        } catch (Exception $e) {
            abort(401);
        }
    }

    /**
     * Password login
     *
     * @param array $data
     * @return object
     * @throws AuthenticationException
     */
    public function password(array $data)
    {
        return $this->proxyOAuth('password', $data);
    }

    /**
     * Proxy client secret API
     *
     * @param string $grant_type
     * @param array $data
     * @return object
     * @throws AuthenticationException
     */
    protected function proxyOAuth(string $grant_type, array $data = [])
    {
        $http = new Guzzle();

        try {
            $response = $http->post(app_url('/oauth/token'), [
                'form_params' => array_merge($data, [
                    'client_id' => (string) env('PASSWORD_CLIENT_ID'),
                    'client_secret' => (string) env('PASSWORD_CLIENT_SECRET'),
                    'grant_type' => $grant_type,
                    'scope' => '',
                ]),
            ]);
        } catch (Exception $e) {
            throw new AuthenticationException();
        }

        $data = json_decode((string) $response->getBody());

        if (isset($data->refresh_token) === true) {
            $this->setRefreshToken($data->refresh_token);
        }

        return $data;
    }

    /**
     * Get refresh token name
     *
     * @return string
     */
    protected function getRefreshTokenName()
    {
        return str()->snake(strtolower(app_name()) . '_' . static::REFRESH_TOKEN);
    }

    /**
     * Get refresh token
     *
     * @param Request $request
     * @return string
     */
    protected function getRefreshToken(Request $request)
    {
        return $request->cookie($this->getRefreshTokenName());
    }

    /**
     * Set refresh token
     *
     * @param string $refresh_token
     * @return void
     */
    protected function setRefreshToken(string $refresh_token)
    {
        cookie()->queue($this->getRefreshTokenName(), $refresh_token, config('cmsoauth.refresh_token_ttl'));
    }

    /**
     * Remove refresh token
     *
     * @return void
     */
    protected function removeRefreshToken()
    {
        cookie()->queue(cookie()->forget($this->getRefreshTokenName()));
    }

    /**
     * Get user from parsed token.
     *
     * @param string|null $bearer
     * @return User
     */
    public function getUserFromToken($bearer = null)
    {
        if (($token = $this->parseToken($bearer)) === null) {
            return null;
        }
        if (($oauth_token = DB::table('oauth_access_tokens')->find($token->getClaim('jti'))) === null) {
            return null;
        }

        return User::find($oauth_token->user_id);
    }

    /**
     * Parse token from request.
     *
     * @param string|null $bearer
     * @return Token
     */
    public function parseToken($bearer = null)
    {
        if (trim(((string) $bearer) ?? ($bearer = (string) request()->bearerToken())) === '') {
            return null;
        }

        $token = (new Parser())->parse($bearer);

        return $token->verify(new Sha256(), file_get_contents(Passport::keyPath('oauth-public.key'))) === false ? null : $token;
    }
}
