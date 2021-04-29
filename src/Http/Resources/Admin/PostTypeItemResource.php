<?php

namespace Tbnt\Cms\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\PostTypeItem;

/**
 * Tbnt\Cms\Http\Resources\Admin\PostTypeItemResource
 *
 * @mixin PostTypeItem
 */
class PostTypeItemResource extends Resource
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
            'conditions' => PostTypeItemConditionResource::collection($this->post_type_item_conditions),
            'config' => $this->data,
            'created_at' => to_iso8601_string($this->created_at),
            'id' => $this->id,
            'is_required' => $this->is_required,
            'is_translatable' => $this->is_translatable,
            'items' => PostTypeItemResource::collection($this->post_type_items_recursive),
            'key' => $this->key,
            'label' => $this->label,
            'mode' => $this->mode,
            'position' => $this->position,
            'post_type_id' => $this->post_type_id,
            'post_type_item_id' => $this->post_type_item_id,
            'restrictions' => PostTypeItemRestrictionResource::collection($this->post_type_item_restrictions),
            'type' => $this->type,
            'updated_at' => to_iso8601_string($this->updated_at),
        ];
    }
}
