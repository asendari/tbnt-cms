<?php

namespace Tbnt\Cms\Http\Requests\Admin;

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
            'email' => 'required|string',
            'lang_id' => 'required|numeric|lang_id_exists',
        ];
    }
}
