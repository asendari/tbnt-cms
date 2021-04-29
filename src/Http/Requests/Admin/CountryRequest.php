<?php

namespace Tbnt\Cms\Http\Requests\Admin;

use Tbnt\Cms\Http\Requests\BaseRequest;

class CountryRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'tva' => 'numeric',
        ];
    }
}
