<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Tbnt\Cms\Model\PostTypeItemCondition
 *
 * @property string $id
 * @property string|null $post_type_item_id
 * @property string|null $post_type_item_id_match
 * @property string|null $post_type_item_id_value
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property int $batch
 * @property-read PostTypeItem|null $post_type_item
 * @property-read PostTypeItem|null $post_type_item_match
 * @property-read PostTypeItem|null $post_type_item_value
 * @method static Builder|PostTypeItemCondition whereBatch($value)
 * @method static Builder|PostTypeItemCondition whereCreatedAt($value)
 * @method static Builder|PostTypeItemCondition whereDeletedAt($value)
 * @method static Builder|PostTypeItemCondition whereId($value)
 * @method static Builder|PostTypeItemCondition wherePostTypeItemId($value)
 * @method static Builder|PostTypeItemCondition wherePostTypeItemIdMatch($value)
 * @method static Builder|PostTypeItemCondition wherePostTypeItemIdValue($value)
 * @method static Builder|PostTypeItemCondition whereUpdatedAt($value)
 */
class PostTypeItemCondition extends BaseModelPost
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'post_type_item_conditions';

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

    /**
     * Post type item match relation
     *
     * @return BelongsTo|PostTypeItem
     */
    public function post_type_item_match()
    {
        return $this->belongsTo(PostTypeItem::class, 'post_type_item_id_match', 'id');
    }

    /**
     * Post type item value relation
     *
     * @return BelongsTo|PostTypeItem
     */
    public function post_type_item_value()
    {
        return $this->belongsTo(PostTypeItem::class, 'post_type_item_id_value', 'id');
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
}
