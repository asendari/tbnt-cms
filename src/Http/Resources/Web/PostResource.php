<?php

namespace Tbnt\Cms\Http\Resources\Web;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\Post;

/**
 * Tbnt\Cms\Http\Resources\Web\PostResource
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
            'canonical' => $this->when($this->post_type->is_page === true, function () {
                return $this->canonical;
            }),
            'id' => $this->id,
            'items' => $this->whenLoaded('post_items_recursive', function () {
                return new PostItemsRecursiveResource($this->post_items_recursive);
            }),
            'key' => $this->post_type->has_key === true ? $this->key : false,
            'lang' => $this->when($this->post_type->is_page === true, function () {
                return new PostLangResource($this->display_lang);
            }),
            'post_id' => $this->post_id,
            'published_at' => $this->whenLoaded('post_items_recursive', function () {
                return to_iso8601_string($this->published_at);
            }),
            'type' => $this->post_type->type,
        ];
    }
}
