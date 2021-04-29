<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * Tbnt\Cms\Model\UserType
 *
 * @property int $id
 * @property string $key
 * @property bool $is_active
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Collection|User[] $users
 * @property-read int|null $users_count
 * @method static Builder|UserType isType($type)
 * @method static \Illuminate\Database\Query\Builder|UserType onlyTrashed()
 * @method static Builder|UserType whereCreatedAt($value)
 * @method static Builder|UserType whereDeletedAt($value)
 * @method static Builder|UserType whereId($value)
 * @method static Builder|UserType whereIsActive($value)
 * @method static Builder|UserType whereKey($value)
 * @method static Builder|UserType whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|UserType withTrashed()
 * @method static \Illuminate\Database\Query\Builder|UserType withoutTrashed()
 */
class UserType extends BaseModel
{
    use SoftDeletes;

    /**
     * The admin type key.
     *
     * @var string
     */
    const ADMIN = 'admin';

    /**
     * The cron type key.
     *
     * @var string
     */
    const CRON = 'cron';

    /**
     * The web type key.
     *
     * @var string
     */
    const WEB = 'web';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_types';

    /**
     * The attributes that should be cast to native types
     *
     * Possible values:
     * integer, real, float, double, string, boolean, object, array, collection, date, datetime, timestamp
     *
     * @var array
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /****************************************************************
     * Scopes
     ***************************************************************/

    /**
     * Scope "isType"
     *
     * @param Builder|static $query
     * @param int|string|array $type Type
     * @return Builder|static
     */
    public function scopeIsType($query, $type)
    {
        return $query->keyId($type, 'key', 'id');
    }

    /****************************************************************
     * Relations
     ***************************************************************/

    /**
     * Users relations
     *
     * @return HasMany|Collection|User[]
     */
    public function users()
    {
        return $this->hasMany(User::class, 'user_type_id', 'id');
    }
}
