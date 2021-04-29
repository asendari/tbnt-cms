<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Tbnt\Cms\Model\Traits\LangTrait;

/**
 * Tbnt\Cms\Model\PostTypeLang
 *
 * @property string $id
 * @property string|null $post_type_id
 * @property int $lang_id
 * @property string|null $label
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property int $batch
 * @property-read string $lang_code
 * @property-read PostType|null $post_type
 * @method static Builder|PostTypeLang hasCurrentDefaultValue($key, $value)
 * @method static Builder|PostTypeLang isCurrentDefaultLang()
 * @method static Builder|PostTypeLang isCurrentLang()
 * @method static Builder|PostTypeLang isDefaultLang()
 * @method static Builder|PostTypeLang isLang($lang = null)
 * @method static Builder|PostTypeLang isLangCode($lang_code = null)
 * @method static Builder|PostTypeLang isLangId($lang_id = null)
 * @method static Builder|PostTypeLang searchCurrentDefaultValues($fields, $searches, $multiple = true)
 * @method static Builder|PostTypeLang whereBatch($value)
 * @method static Builder|PostTypeLang whereCreatedAt($value)
 * @method static Builder|PostTypeLang whereDeletedAt($value)
 * @method static Builder|PostTypeLang whereId($value)
 * @method static Builder|PostTypeLang whereLabel($value)
 * @method static Builder|PostTypeLang whereLangId($value)
 * @method static Builder|PostTypeLang wherePostTypeId($value)
 * @method static Builder|PostTypeLang whereUpdatedAt($value)
 */
class PostTypeLang extends BaseModelPost
{
    use LangTrait;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'post_type_langs';

    /**
     * All of the relationships to be touched
     *
     * @var array
     */
    protected $touches = ['post_type'];

    /**
     * The array of translatable columns.
     *
     * @var array
     */
    public $attributes_lang = ['label'];

    /****************************************************************
     * Relations
     ***************************************************************/

    /**
     * Post type relation
     *
     * @return BelongsTo|PostType
     */
    public function post_type()
    {
        return $this->belongsTo(PostType::class, 'post_type_id', 'id');
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
        return $this->post_type->isMigratable();
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
