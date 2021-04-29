<?php

namespace Tbnt\Cms\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\Post;

/**
 * Tbnt\Cms\Http\Resources\Admin\PostListResource
 *
 * @mixin Post
 */
class PostListResource extends Resource
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
            'hidden_at' => to_iso8601_string($this->hidden_at),
            'id' => $this->id,
            'is_active' => $this->is_active,
            'key' => $this->key,
            'position' => $this->position,
            'post_id' => $this->post_id,
            'post_type_id' => $this->post_type_id,
            'reference' => $this->reference,
            'updated_at' => to_iso8601_string($this->updated_at),
            'visible_at' => to_iso8601_string($this->visible_at),
        ];
    }
}
