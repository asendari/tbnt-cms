<?php

namespace Tbnt\Cms\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller;

class BaseController extends Controller
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Validate inputs
     *
     * @param array $rules
     * @param array|null $messages
     * @return array
     */
    public function validate(array $rules, $messages = null)
    {
        return request()->validate($rules, $messages ?? __('cms::validation'));
    }
}
