<?php

namespace Tbnt\Cms\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\UserCron;

/**
 * Tbnt\Cms\Http\Resources\Admin\UserCronResource
 *
 * @mixin UserCron
 */
class UserCronResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [];
    }
}
