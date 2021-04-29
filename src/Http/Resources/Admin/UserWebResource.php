<?php

namespace Tbnt\Cms\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\UserWeb;

/**
 * Tbnt\Cms\Http\Resources\Admin\UserWebResource
 *
 * @mixin UserWeb
 */
class UserWebResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'email' => $this->email,
            'firstname' => $this->firstname,
            'image' => new FileResource($this->image),
            'lastname' => $this->lastname,
            'name' => $this->name,
        ];
    }
}
