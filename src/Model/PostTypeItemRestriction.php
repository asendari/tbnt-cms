<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Tbnt\Cms\Model\PostTypeItemRestriction
 *
 * @property string $id
 * @property string|null $post_id
 * @property string|null $post_type_item_id
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property int $batch
 * @property-read Post|null $post
 * @property-read PostTypeItem|null $post_type_item
 * @method static Builder|PostTypeItemRestriction whereBatch($value)
 * @method static Builder|PostTypeItemRestriction whereCreatedAt($value)
 * @method static Builder|PostTypeItemRestriction whereDeletedAt($value)
 * @method static Builder|PostTypeItemRestriction whereId($value)
 * @method static Builder|PostTypeItemRestriction wherePostId($value)
 * @method static Builder|PostTypeItemRestriction wherePostTypeItemId($value)
 * @method static Builder|PostTypeItemRestriction whereUpdatedAt($value)
 */
class PostTypeItemRestriction extends BaseModelPost
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'post_type_item_restrictions';

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
     * Post relation
     *
     * @return BelongsTo|Post
     */
    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id', 'id');
    }

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
}
