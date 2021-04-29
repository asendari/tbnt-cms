<?php

namespace Tbnt\Cms\Http\Controllers\Api\Web;

use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Http\Requests\Web\UserRequest;
use Tbnt\Cms\Http\Resources\Web\UserResource;

class UserController extends BaseController
{
    /**
     * Update user
     *
     * @param UserRequest $request
     * @return UserResource
     */
    public function update(UserRequest $request)
    {
        $user = auth()->user();

        $this->validate([
            'email' => 'required|email|user_email_unique:' . $user->username,
        ]);

        $user->updateData($request->all());
        $user->user_web->updateData($request->all());

        $password = $request->input('password');

        if ($password) {
            $user->updatePassword($password);
        }

        return new UserResource(auth()->user());
    }
}
