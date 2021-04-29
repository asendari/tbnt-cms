<?php

namespace Tbnt\Cms\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\User;

/**
 * Tbnt\Cms\Http\Resources\Admin\UserResource
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
            'created_at' => to_iso8601_string($this->created_at),
            'id' => $this->id,
            'is_active' => $this->is_active,
            'lang_id' => $this->lang_id,
            'last_connected_at' => to_iso8601_string($this->last_connected_at),
            'last_login_at' => to_iso8601_string($this->last_login_at),
            'profile' =>
                $this->isTypeAdmin() === true
                    ? new UserAdminResource($this->profile)
                    : ($this->isTypeCron() === true
                        ? new UserCronResource($this->profile)
                        : ($this->isTypeWeb() === true
                            ? new UserWebResource($this->profile)
                            : null)),
            'updated_at' => to_iso8601_string($this->updated_at),
        ];
    }
}
