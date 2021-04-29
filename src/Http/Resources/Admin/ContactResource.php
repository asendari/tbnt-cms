<?php

namespace Tbnt\Cms\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\Contact;

/**
 * Tbnt\Cms\Http\Resources\Admin\ContactResource
 *
 * @mixin Contact
 */
class ContactResource extends Resource
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
            'content' => $this->content,
            'created_at' => to_iso8601_string($this->created_at),
            'email' => $this->email,
        ];
    }
}
