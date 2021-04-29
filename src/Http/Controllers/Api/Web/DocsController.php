<?php

namespace Tbnt\Cms\Http\Controllers\Api\Web;

use File;
use Tbnt\Cms\Http\Controllers\BaseController;

class DocsController extends BaseController
{
    /**
     * Get api docs
     *
     * @return string
     */
    public function get()
    {
        return File::get(__DIR__ . '/../../../../../docs/api.html');
    }
}
