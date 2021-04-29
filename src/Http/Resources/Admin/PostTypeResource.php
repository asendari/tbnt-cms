<?php

namespace Tbnt\Cms\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\PostType;

/**
 * Tbnt\Cms\Http\Resources\Admin\PostTypeResource
 *
 * @mixin PostType
 */
class PostTypeResource extends Resource
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
            'config' => $this->data,
            'created_at' => to_iso8601_string($this->created_at),
            'has_key' => $this->has_key,
            'id' => $this->id,
            'is_active' => $this->is_active,
            'is_loaded' => $this->is_loaded,
            'is_page' => $this->is_page,
            'items' => $this->whenLoaded('post_type_items_recursive', function () {
                return PostTypeItemResource::collection($this->post_type_items_recursive);
            }),
            'label' => $this->label,
            'mode' => $this->mode,
            'type' => $this->type,
            'updated_at' => to_iso8601_string($this->updated_at),
        ];
    }
}
