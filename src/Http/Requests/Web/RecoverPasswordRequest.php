<?php

namespace Tbnt\Cms\Http\Requests\Web;

use Tbnt\Cms\Http\Requests\BaseRequest;

class RecoverPasswordRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|confirmed',
        ];
    }
}
