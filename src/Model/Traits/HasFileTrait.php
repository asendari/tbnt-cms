<?php

namespace Tbnt\Cms\Model\Traits;

use Eloquent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Tbnt\Cms\Model\File;

/**
 * Tbnt\Cms\Model\Traits\HasFileTrait
 *
 * @mixin Eloquent
 */
trait HasFileTrait
{
    /**
     * Update file
     *
     * @param string $key Attribute
     * @param UploadedFile|string $file File
     * @param array $options
     * @param string|null $key_id
     * @return File|Eloquent|Model|false|void
     */
    public function updateFile(string $key, $file, $options = [], $key_id = null)
    {
        if (is_string($file) === true) {
            if ($file === 'delete') {
                $this->deleteFile($key, $key_id);
            }
        } else {
            return $this->uploadFile($key, $file, $options, $key_id);
        }
    }

    /**
     * Upload file
     *
     * @param string $key Attribute
     * @param UploadedFile $file File
     * @param array $options Options
     * @param string|null $key_id Override generated key
     * @return File|Eloquent|Model|false
     */
    protected function uploadFile(string $key, UploadedFile $file, $options = [], $key_id = null)
    {
        if (is_object($file) === false || get_class($file) !== UploadedFile::class) {
            return false;
        }

        $file = media()->upload($this->{$key}, $file, $options);

        if ($key_id !== false) {
            $key_id = $key_id ?: $key . '_id';

            $this->updateEntry($key_id, $file->id);
            $this->refresh();
        }

        return $file;
    }

    /**
     * Delete file
     *
     * @param string $key Attribute
     * @param string|null $key_id Override generated key
     * @return void
     */
    protected function deleteFile(string $key, $key_id = null)
    {
        $this->{$key}->delete();
        $this->updateEntry($key_id ?: $key . '_id', 0);
        $this->reload([$key]);
    }
}
