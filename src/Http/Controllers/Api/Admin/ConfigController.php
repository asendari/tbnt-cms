<?php

namespace Tbnt\Cms\Http\Controllers\Api\Admin;

use Illuminate\Http\Response;
use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Http\Resources\Admin\PostTypeResource;
use Tbnt\Cms\Model\PostType;

class ConfigController extends BaseController
{
    /**
     * Get config
     *
     * @return Response
     */
    public function get()
    {
        return response([
            'posts_types' => PostTypeResource::collection(PostType::with(app(PostTypeController::class)->with)->get()),
        ]);
    }
}
