<?php

namespace Tbnt\Cms\Http\Resources\Web;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\PostLang;

/**
 * Tbnt\Cms\Http\Resources\Web\PostLangResource
 *
 * @mixin PostLang
 */
class PostLangResource extends Resource
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
            'description' => $this->description,
            'title' => $this->title,
            'url' => $this->url,
        ];
    }
}
