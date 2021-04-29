<?php

namespace Tbnt\Cms\Http\Controllers\Web;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Tbnt\Cms\Http\Controllers\BaseController;

class UploadController extends BaseController
{
    /**
     * Get media
     *
     * @param Request $request
     * @param string $path
     * @return BinaryFileResponse
     */
    public function one(Request $request, string $path)
    {
        if (media()->exists($path) === false) {
            abort(404);
        }

        return response()->file(media_root($path));
    }
}
