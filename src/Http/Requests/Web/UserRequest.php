<?php

namespace Tbnt\Cms\Http\Requests\Web;

use Tbnt\Cms\Http\Requests\BaseRequest;

class UserRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'email' => 'required|email',
            'password' => 'string|confirmed', // password && password_confirmation
            'lang_id' => 'numeric',
        ];
    }
}
