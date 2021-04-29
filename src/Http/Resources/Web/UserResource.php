<?php

namespace Tbnt\Cms\Http\Resources\Web;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\User;

/**
 * Tbnt\Cms\Http\Resources\Web\UserResource
 *
 * @mixin User
 */
class UserResource extends Resource
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
            'id' => $this->id,
            'lang_id' => $this->lang_id,
            'profile' => $this->isTypeWeb() === true ? new UserWebResource($this->profile) : null,
        ];
    }
}
