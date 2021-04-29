<?php

namespace Tbnt\Cms\Http\Controllers\Api\Web;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Tbnt\Cms\Http\Controllers\Api\AuthController as Controller;
use Tbnt\Cms\Http\Requests\Web\ForgotPasswordRequest;
use Tbnt\Cms\Http\Requests\Web\LoginRequest;
use Tbnt\Cms\Http\Requests\Web\RecoverPasswordRequest;
use Tbnt\Cms\Http\Requests\Web\SignInRequest;
use Tbnt\Cms\Http\Resources\Web\UserResource;
use Tbnt\Cms\Model\User;
use Tbnt\Cms\Model\UserPasswordReset;
use Tbnt\Cms\Model\UserType;

class AuthController extends Controller
{
    /**
     * Refresh token
     *
     * @var string
     */
    const REFRESH_TOKEN = 'session_web';

    /**
     * Get user
     *
     * @return UserResource
     */
    public function me()
    {
        return new UserResource(auth()->user());
    }

    /**
     * Sign in forn
     *
     * @param SignInRequest $request
     * @return UserResource
     * @throws AuthenticationException
     */
    public function signin(SignInRequest $request)
    {
        // Get user
        $user = User::isWeb()
            ->where('username', $request->input('email'))
            ->first();

        // Check if user exists
        if ($user !== null) {
            abort(401);
        }

        // Create user
        $user = new User([
            'user_type_id' => UserType::where('key', UserType::WEB)->first()->id,
            'username' => $request->input('email'),
        ]);

        // Set active
        $user->setActive(true);

        // Update user password
        $user->updatePassword($request->input('password'));

        // Update user data
        $user->updateData($request->all());
        $user->user_web->updateData($request->all());

        // Get token
        $token = $this->password([
            'username' => $request->input('email'),
            'password' => $request->input('password'),
        ]);

        // Update last auth at
        $user->updateLastAuthAt();

        return (new UserResource($user))->additional([
            'token' => $token->access_token,
        ]);
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
        $user = User::isWeb()
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
    public function refresh(Request $request)
    {
        $token = parent::refreshToken($request)->access_token;

        return (new UserResource($this->getUserFromToken($token)))->additional([
            'token' => $token,
        ]);
    }

    /**
     * Forgot password
     *
     * @param ForgotPasswordRequest $request
     * @return void
     */
    public function forgot(ForgotPasswordRequest $request)
    {
        // Get user
        $user = User::isWeb()
            ->where('username', $request->input('email'))
            ->first();

        // Send recovery password
        if ($user !== null) {
            $user->user_web->sendMailResetPassword($user->generateResetPasswordToken());
        }
    }

    /**
     * Recover password
     *
     * @param RecoverPasswordRequest $request
     * @return void
     */
    public function recover(RecoverPasswordRequest $request)
    {
        // Get recovery password
        $token = UserPasswordReset::where('token', $request->input('token'))->first();

        if ($token === null) {
            abort(401);
        }

        // Get user
        $user = $token->user;

        // Check token
        if (
            $user === null ||
            $user->checkResetPasswordToken($token->token) === false ||
            $user->username !== $request->input('email')
        ) {
            abort(401, 'reset_failed');
        }

        // Update user password
        $user->updatePassword($request->input('password'));

        // Delete user tokens
        $user->password_resets->each->delete();
    }
}
