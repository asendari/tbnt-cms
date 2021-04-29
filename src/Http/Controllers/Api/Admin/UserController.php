<?php

namespace Tbnt\Cms\Http\Controllers\Api\Admin;

use Exception;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Http\Requests\Admin\UserRequest;
use Tbnt\Cms\Http\Resources\Admin\UserResource;
use Tbnt\Cms\Model\User;
use Tbnt\Cms\Model\UserType;

class UserController extends BaseController
{
    /**
     * Get users
     *
     * @param Request $request
     * @param array $options
     * @return Builder|User
     */
    public function get(Request $request, $options = [])
    {
        $query_options = array_merge(
            [
                'date' => date('Y-m-d H:i:s'),
                'order' => 'created_at-1',
                'with' => [],
                'ids' => -1,
                'search' => '',
            ],
            $request->input(),
            $options
        );

        $query = User::isWeb()
            ->with($query_options['with'])
            ->isBefore($query_options['date'])
            ->isOrdered($query_options['order']);

        if ($query_options['ids'] !== -1) {
            $query->within($query_options['ids']);
        }

        if (trim($query_options['search']) !== '') {
            $query->hasSearch($query_options['search']);
        }

        return $query;
    }

    /**
     * List users
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function list(Request $request)
    {
        return UserResource::collection($this->get($request)->paginate());
    }

    /**
     * Get user
     *
     * @param Request $request
     * @param User $user
     * @return UserResource
     */
    public function one(Request $request, User $user)
    {
        return new UserResource($user);
    }

    /**
     * Create user
     *
     * @param UserRequest $request
     * @return UserResource
     */
    public function create(UserRequest $request)
    {
        $this->validate([
            'email' => 'required|email|user_email_unique',
        ]);

        $user = new User([
            'user_type_id' => UserType::where('key', UserType::WEB)->first()->id,
            'username' => $request->input('email'),
        ]);

        $user->updatePassword($request->input('password'));

        $user->updateData($request->all());
        $user->user_web->updateData($request->all());

        return $this->one($request, $user->fresh());
    }

    /**
     * Update user
     *
     * @param UserRequest $request
     * @param User $user
     * @return UserResource
     */
    public function oneUpdate(UserRequest $request, User $user)
    {
        $this->validate([
            'email' => 'required|email|user_email_unique:' . $user->username,
        ]);

        $user->updateUsername($request->input('email'));

        $user->updateData($request->all());
        $user->user_web->updateData($request->all());

        $password = $request->input('password');

        if ($password) {
            $this->oneUpdatePassword($request, $user, $password);
        }

        return $this->one($request, $user);
    }

    /**
     * Update user password
     *
     * @param Request $request
     * @param User $user
     * @param string $password
     * @return UserResource
     */
    public function oneUpdatePassword(Request $request, User $user, $password = '')
    {
        $password = $password ?: $user->generatePassword();

        $user->updatePassword($password);
        $user->user_web->sendMailNewPassword($password);

        return $this->one($request, $user);
    }

    /**
     * Active user
     *
     * @param Request $request
     * @param User $user
     * @return UserResource
     */
    public function oneActive(Request $request, User $user)
    {
        $user->setActive(true);

        if ($user->password === '') {
            $user->user_web->sendMailAccountActivated($user->generateResetPasswordToken());
        }

        return $this->one($request, $user);
    }

    /**
     * Inactive user
     *
     * @param Request $request
     * @param User $user
     * @return UserResource
     */
    public function oneInactive(Request $request, User $user)
    {
        $user->setActive(false);

        return $this->one($request, $user);
    }

    /**
     * Delete user
     *
     * @param Request $request
     * @param User $user
     * @return UserResource
     * @throws Exception
     */
    public function oneDelete(Request $request, User $user)
    {
        $user->delete();

        return $this->one($request, $user);
    }

    /**
     * Send forgotten password email to user
     *
     * @param Request $request
     * @param User $user
     * @return void
     */
    public function oneForgottenPassword(Request $request, User $user)
    {
        $client = new Client();
        $client->post(app_url('cms/web/auth/forgot-password'), [
            'json' => ['email' => $user->user_web->email],
        ]);
    }
}
