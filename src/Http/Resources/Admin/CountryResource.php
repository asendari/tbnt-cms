<?php

namespace Tbnt\Cms\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\Country;

/**
 * Tbnt\Cms\Http\Resources\Admin\CountryResource
 *
 * @mixin Country
 */
class CountryResource extends Resource
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
            'code' => $this->code,
            'id' => $this->id,
            'name' => $this->name,
            'tva' => $this->tva,
        ];
    }
}
