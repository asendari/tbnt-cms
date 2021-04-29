<?php

namespace Tbnt\Cms\Http\Controllers\Api\Admin;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Tbnt\Cms\Http\Controllers\Api\AuthController as Controller;
use Tbnt\Cms\Http\Requests\Admin\LoginRequest;
use Tbnt\Cms\Http\Resources\Admin\UserResource;
use Tbnt\Cms\Model\User;

class AuthController extends Controller
{
    /**
     * Refresh token
     *
     * @var string
     */
    const REFRESH_TOKEN = 'session_admin';

    /**
     * Get me
     *
     * @return UserResource
     */
    public function me()
    {
        return new UserResource(auth()->user());
    }

    /**
     * Login form
     *
     * @param LoginRequest $request
     * @return UserResource
     * @throws AuthenticationException
     */
    public function login(LoginRequest $request)
    {
        // Get token
        $token = $this->password([
            'username' => $request->input('email'),
            'password' => $request->input('password'),
        ]);

        // Get user
        $user = User::isAdmin()
            ->where('username', $request->input('email'))
            ->first();

        if ($user === null) {
            abort(401);
        }
        if ($user->is_active === false) {
            abort(401, 'user_inactive');
        }

        // Update last auth at
        $user->updateLastAuthAt();

        return (new UserResource($user))->additional([
            'token' => $token->access_token,
        ]);
    }

    /**
     * Refresh token
     *
     * @param Request $request
     * @return UserResource
     */
    public function refreshToken(Request $request)
    {
        $token = parent::refreshToken($request)->access_token;

        return (new UserResource($this->getUserFromToken($token)))->additional([
            'token' => $token,
        ]);
    }
}
