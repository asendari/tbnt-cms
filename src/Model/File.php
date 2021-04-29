<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * Tbnt\Cms\Model\File
 *
 * @property string $id
 * @property string $filename
 * @property bool $is_image
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property int $batch
 * @property-read resource $file
 * @property-read bool $file_exists
 * @property-read string $file_root
 * @property-read int $file_size
 * @property-read string $filepath
 * @property-read string $fileurl
 * @property-read string $name
 * @property-read bool $thumb_exists
 * @property-read string $thumbpath
 * @property-read string $thumburl
 * @method static \Illuminate\Database\Query\Builder|File onlyTrashed()
 * @method static Builder|File whereBatch($value)
 * @method static Builder|File whereCreatedAt($value)
 * @method static Builder|File whereDeletedAt($value)
 * @method static Builder|File whereFilename($value)
 * @method static Builder|File whereId($value)
 * @method static Builder|File whereIsImage($value)
 * @method static Builder|File whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|File withTrashed()
 * @method static \Illuminate\Database\Query\Builder|File withoutTrashed()
 */
class File extends BaseModelUuid
{
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'files';

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /****************************************************************
     * Scopes
     ***************************************************************/

    /**
     * Scope "migratable"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeMigratable($query)
    {
        return $query;
    }

    /****************************************************************
     * Attributes
     ***************************************************************/

    /**
     * Get "name" attribute
     *
     * @return string
     */
    public function getNameAttribute()
    {
        return arr()->last(explode('/', $this->filename));
    }

    /**
     * Get "file" attribute
     *
     * @return resource
     */
    public function getFileAttribute()
    {
        return media()->getFile($this->filename);
    }

    /**
     * Get "exists" attribute
     *
     * @return bool
     */
    public function getFileExistsAttribute()
    {
        return media_exists($this->filename);
    }

    /**
     * Get "file_root" attribute
     *
     * @return string
     */
    public function getFileRootAttribute()
    {
        return $this->file_exists === true ? media_root($this->filename) : null;
    }

    /**
     * Get "filepath" attribute
     *
     * @return string
     */
    public function getFilepathAttribute()
    {
        return $this->file_exists === true ? media_local($this->filename) : null;
    }

    /**
     * Get "fileurl" attribute
     *
     * @return string
     */
    public function getFileurlAttribute()
    {
        return $this->file_exists === true ? media_url($this->filename) : null;
    }

    /**
     * Get "file_size" attribute
     *
     * @return int
     */
    public function getFileSizeAttribute()
    {
        return $this->file_exists === true ? filesize($this->file_root) : null;
    }

    /**
     * Get "thumb_exists" attribute
     *
     * @return bool
     */
    public function getThumbExistsAttribute()
    {
        return $this->is_image === true && thumb_exists($this->filename);
    }

    /**
     * Get "thumbpath" path attribute
     *
     * @return string
     */
    public function getThumbpathAttribute()
    {
        return $this->thumb_exists === true ? thumb_local($this->filename) : null;
    }

    /**
     * Get "thumburl" url attribute
     *
     * @return string
     */
    public function getThumburlAttribute()
    {
        return $this->thumb_exists === true ? thumb_url($this->filename) : null;
    }

    /**
     * Get "is_image" attribute
     *
     * @return bool
     */
    public function getIsImageAttribute()
    {
        return $this->file_root && media()->isImage($this->file_root);
    }

    /****************************************************************
     * Object
     ***************************************************************/

    /**
     * Return the migration status.
     *
     * @return bool
     */
    public function isMigratable()
    {
        return true;
    }

    /**
     * Update name
     *
     * @param string $filename File filename
     * @return void
     */
    public function updateName(string $filename)
    {
        $this->update(['filename' => $filename]);
    }
}
