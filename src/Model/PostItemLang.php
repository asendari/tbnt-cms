<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Tbnt\Cms\Model\Traits\HasFileTrait;
use Tbnt\Cms\Model\Traits\LangTrait;

/**
 * Tbnt\Cms\Model\PostItemLang
 *
 * @property string $id
 * @property string|null $post_item_id
 * @property int $lang_id
 * @property string|null $value
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property int $batch
 * @property-read File|null $file
 * @property-read mixed $formatted_value
 * @property-read string $lang_code
 * @property-read string $value_type
 * @property-read PostItem|null $post_item
 * @method static Builder|PostItemLang hasCurrentDefaultValue($key, $value)
 * @method static Builder|PostItemLang isCurrentDefaultLang()
 * @method static Builder|PostItemLang isCurrentLang()
 * @method static Builder|PostItemLang isDefaultLang()
 * @method static Builder|PostItemLang isLang($lang = null)
 * @method static Builder|PostItemLang isLangCode($lang_code = null)
 * @method static Builder|PostItemLang isLangId($lang_id = null)
 * @method static Builder|PostItemLang searchCurrentDefaultValues($fields, $searches, $multiple = true)
 * @method static Builder|PostItemLang whereBatch($value)
 * @method static Builder|PostItemLang whereCreatedAt($value)
 * @method static Builder|PostItemLang whereDeletedAt($value)
 * @method static Builder|PostItemLang whereId($value)
 * @method static Builder|PostItemLang whereLangId($value)
 * @method static Builder|PostItemLang wherePostItemId($value)
 * @method static Builder|PostItemLang whereUpdatedAt($value)
 * @method static Builder|PostItemLang whereValue($value)
 */
class PostItemLang extends BaseModelPost
{
    use LangTrait, HasFileTrait;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'post_item_langs';

    /**
     * All of the relationships to be touched
     *
     * @var array
     */
    protected $touches = ['post_item'];

    /**
     * The array of translatable columns.
     *
     * @var array
     */
    public $attributes_lang = ['value'];

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
        return $query->whereHas('post_item', function ($query) {
            return $query->migratable();
        });
    }

    /****************************************************************
     * Relations
     ***************************************************************/

    /**
     * Post item relation
     *
     * @return BelongsTo|PostItem
     */
    public function post_item()
    {
        return $this->belongsTo(PostItem::class, 'post_item_id', 'id');
    }

    /**
     * File relation
     *
     * @return BelongsTo|File
     */
    public function file()
    {
        return $this->belongsTo(File::class, 'value');
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
        return $this->post_item->isMigratable();
    }

    /**
     * Get uploads directory
     *
     * @return string
     */
    public function getUploadDir()
    {
        return $this->post_item->getUploadDir();
    }

    /**
     * Update data
     *
     * @param array $data Data
     * @return void
     */
    public function updateData(array $data)
    {
        $this->updateEntries($data, ['value']);
    }
}
