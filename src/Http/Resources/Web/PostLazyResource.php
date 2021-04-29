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
class PostLazyResource extends Resource
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
            'key' => $this->post_type->has_key === true ? $this->key : false,
            'lang' => $this->when($this->post_type->is_page === true, function () {
                return new PostLangResource($this->display_lang);
            }),
            'post_id' => $this->post_id,
            'type' => $this->post_type->type,
        ];
    }
}
