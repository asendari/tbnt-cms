<?php

namespace Tbnt\Cms\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\PostTypeItemCondition;

/**
 * Tbnt\Cms\Http\Resources\Admin\PostTypeItemConditionResource
 *
 * @mixin PostTypeItemCondition
 */
class PostTypeItemConditionResource extends Resource
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
            'post_type_item_id' => $this->post_type_item_id,
            'post_type_item_id_match' => $this->post_type_item_id_match,
            'post_type_item_id_value' => $this->post_type_item_id_value,
            'updated_at' => to_iso8601_string($this->updated_at),
            'value' => $this->post_type_item_value->data->value ?? null,
        ];
    }
}
