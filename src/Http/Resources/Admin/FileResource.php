<?php

namespace Tbnt\Cms\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\File;

/**
 * Tbnt\Cms\Http\Resources\Admin\FileResource
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
            'file_exists' => $this->file_exists,
            'filepath' => $this->filepath,
            'fileurl' => $this->fileurl,
            'id' => $this->id,
            'is_image' => $this->is_image,
            'name' => $this->name,
            'thumb_exists' => $this->thumb_exists,
            'thumbpath' => $this->thumbpath,
            'thumburl' => $this->thumburl,
        ];
    }
}
