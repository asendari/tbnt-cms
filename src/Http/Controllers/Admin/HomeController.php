<?php

namespace Tbnt\Cms\Http\Controllers\Admin;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\View\View;
use Tbnt\Cms\Http\Controllers\BaseController;

class HomeController extends BaseController
{
    /**
     * Get home page
     *
     * @return Application|Factory|View
     */
    public function getPage()
    {
        return view('cms::admin.app');
    }
}
