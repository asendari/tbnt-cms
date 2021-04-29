<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Tbnt\Cms\Model\Traits\LangTrait;

/**
 * Tbnt\Cms\Model\PostTypeItemLang
 *
 * @property string $id
 * @property string|null $post_type_item_id
 * @property int $lang_id
 * @property string|null $label
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property int $batch
 * @property-read string $lang_code
 * @property-read PostTypeItem|null $post_type_item
 * @method static Builder|PostTypeItemLang hasCurrentDefaultValue($key, $value)
 * @method static Builder|PostTypeItemLang isCurrentDefaultLang()
 * @method static Builder|PostTypeItemLang isCurrentLang()
 * @method static Builder|PostTypeItemLang isDefaultLang()
 * @method static Builder|PostTypeItemLang isLang($lang = null)
 * @method static Builder|PostTypeItemLang isLangCode($lang_code = null)
 * @method static Builder|PostTypeItemLang isLangId($lang_id = null)
 * @method static Builder|PostTypeItemLang searchCurrentDefaultValues($fields, $searches, $multiple = true)
 * @method static Builder|PostTypeItemLang whereBatch($value)
 * @method static Builder|PostTypeItemLang whereCreatedAt($value)
 * @method static Builder|PostTypeItemLang whereDeletedAt($value)
 * @method static Builder|PostTypeItemLang whereId($value)
 * @method static Builder|PostTypeItemLang whereLabel($value)
 * @method static Builder|PostTypeItemLang whereLangId($value)
 * @method static Builder|PostTypeItemLang wherePostTypeItemId($value)
 * @method static Builder|PostTypeItemLang whereUpdatedAt($value)
 */
class PostTypeItemLang extends BaseModelPost
{
    use LangTrait;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'post_type_item_langs';

    /**
     * All of the relationships to be touched
     *
     * @var array
     */
    protected $touches = ['post_type_item'];

    /**
     * The array of translatable columns.
     *
     * @var array
     */
    public $attributes_lang = ['label'];

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
     * Relations
     ***************************************************************/

    /**
     * Post type item relation
     *
     * @return BelongsTo|PostTypeItem
     */
    public function post_type_item()
    {
        return $this->belongsTo(PostTypeItem::class, 'post_type_item_id', 'id');
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
        return $this->post_type_item->isMigratable();
    }

    /**
     * Update data
     *
     * @param array $data Data
     * @return void
     */
    public function updateData(array $data)
    {
        $this->updateEntries($data, ['label']);
    }
}
