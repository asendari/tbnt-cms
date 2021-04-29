<?php

namespace Tbnt\Cms\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Determine the validation messages.
     *
     * @return array
     */
    public function messages()
    {
        return __('cms::validation');
    }
}
