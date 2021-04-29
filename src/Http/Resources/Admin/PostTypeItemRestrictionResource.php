<?php

namespace Tbnt\Cms\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\PostTypeItemRestriction;

/**
 * Tbnt\Cms\Http\Resources\Admin\PostTypeItemRestrictionResource
 *
 * @mixin PostTypeItemRestriction
 */
class PostTypeItemRestrictionResource extends Resource
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
            'post_id' => $this->post_id,
            'post_type_item_id' => $this->post_type_item_id,
            'updated_at' => to_iso8601_string($this->updated_at),
        ];
    }
}
