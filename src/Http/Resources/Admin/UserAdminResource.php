<?php

namespace Tbnt\Cms\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\UserAdmin;

/**
 * Tbnt\Cms\Http\Resources\Admin\UserAdminResource
 *
 * @mixin UserAdmin
 */
class UserAdminResource extends Resource
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
            'is_superadmin' => $this->is_superadmin,
        ];
    }
}
