<?php

namespace Tbnt\Cms\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\Post;

/**
 * Tbnt\Cms\Http\Resources\Admin\PostResource
 *
 * @mixin Post
 */
class PostResource extends Resource
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
            'hidden_at' => to_iso8601_string($this->hidden_at),
            'id' => $this->id,
            'is_active' => $this->is_active,
            'is_indexable' => $this->is_indexable,
            'is_visible' => $this->is_visible,
            'items' => $this->whenLoaded('post_items_recursive', function () {
                return new PostItemsRecursiveResource($this->post_items_recursive);
            }),
            'key' => $this->key,
            'lang' => new PostLangDisplayResource($this->display_lang),
            'position' => $this->position,
            'post_id' => $this->post_id,
            'post_type_id' => $this->post_type_id,
            'reference' => $this->reference,
            'trans' => PostLangResource::collection($this->trans->keyBy('lang_code')),
            'updated_at' => to_iso8601_string($this->updated_at),
            'visible_at' => to_iso8601_string($this->visible_at),
        ];
    }
}
