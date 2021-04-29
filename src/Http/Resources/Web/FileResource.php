<?php

namespace Tbnt\Cms\Http\Resources\Web;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\File;

/**
 * Tbnt\Cms\Http\Resources\Web\FileResource
 *
 * @mixin File
 */
class FileResource extends Resource
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
            'exists' => $this->file_exists,
            'fileurl' => $this->when($this->file_exists === true, function () {
                return $this->fileurl;
            }),
            'id' => $this->id,
            'is_image' => $this->when($this->file_exists === true, function () {
                return $this->is_image;
            }),
            'name' => $this->name,
            'size' => $this->when($this->file_exists === true, function () {
                return $this->file_size;
            }),
            'thumburl' => $this->when($this->thumb_exists === true, function () {
                return $this->thumburl;
            }),
        ];
    }
}
