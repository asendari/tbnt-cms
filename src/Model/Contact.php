<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * Tbnt\Cms\Model\Contact
 *
 * @property int $id
 * @property string $email
 * @property object $content
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property-write mixed $data
 * @property-read User $user
 * @method static Builder|Contact hasSearch($value)
 * @method static Builder|Contact isOrdered($order)
 * @method static \Illuminate\Database\Query\Builder|Contact onlyTrashed()
 * @method static Builder|Contact whereContent($value)
 * @method static Builder|Contact whereCreatedAt($value)
 * @method static Builder|Contact whereDeletedAt($value)
 * @method static Builder|Contact whereEmail($value)
 * @method static Builder|Contact whereId($value)
 * @method static Builder|Contact whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|Contact withTrashed()
 * @method static \Illuminate\Database\Query\Builder|Contact withoutTrashed()
 */
class Contact extends BaseModel
{
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'contacts';

    /**
     * The attributes that aren't mass assignable
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast to native types
     *
     * Possible values:
     * integer, real, float, double, string, boolean, object, array, collection, date, datetime, timestamp
     *
     * @var array
     */
    protected $casts = [
        'content' => 'object',
    ];

    /****************************************************************
     * Scopes
     ***************************************************************/

    /**
     * Scope "isOrdered"
     *
     * @param Builder|static $query
     * @param string $order Order
     * @return Builder|static
     */
    public function scopeIsOrdered($query, string $order)
    {
        if (!$order) {
            return $query;
        }

        $order_type = explode('-', $order)[0];
        $order_direction = intval(explode('-', $order)[1] ?? 0) === 0 ? 'ASC' : 'DESC';

        return $query->orderBy($this->tableCol($order_type), $order_direction);
    }

    /**
     * Scope "hasSearch"
     *
     * @param Builder|static $query
     * @param string|array $searches Searches
     * @return Builder|static
     */
    public function scopeHasSearch($query, $searches)
    {
        return $query->search(['email', 'content'], $searches);
    }

    /****************************************************************
     * Mutators
     ***************************************************************/

    /**
     * Set "content" attribute
     *
     * @param mixed $value
     * @return void
     */
    public function setDataAttribute($value)
    {
        $this->attributes['content'] = $value ? json_encode($value) : '';
    }

    /****************************************************************
     * Relations
     ***************************************************************/

    /**
     * User relation
     *
     * @return BelongsTo|User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'email', 'username');
    }

    /****************************************************************
     * Object
     ***************************************************************/

    /**
     * Update data
     *
     * @param array $data Data
     * @return void
     */
    public function updateData(array $data)
    {
        $this->updateEntries($data, ['email', 'content']);
    }
}
