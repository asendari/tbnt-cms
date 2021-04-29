<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Tbnt\Cms\Model\UserPasswordReset
 *
 * @property int $id
 * @property int $user_id
 * @property string $token
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property-read User $user
 * @method static Builder|UserPasswordReset inTime()
 * @method static Builder|UserPasswordReset whereCreatedAt($value)
 * @method static Builder|UserPasswordReset whereId($value)
 * @method static Builder|UserPasswordReset whereToken($value)
 * @method static Builder|UserPasswordReset whereUpdatedAt($value)
 * @method static Builder|UserPasswordReset whereUserId($value)
 */
class UserPasswordReset extends BaseModel
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_password_resets';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['token'];

    /**
     * The attributes that should be hidden for arrays.
     * When hiding relationships, use the relationship's method name.
     *
     * @var array
     */
    protected $hidden = ['user_id'];

    /****************************************************************
     * Scopes
     ***************************************************************/

    /**
     * Scope "inTime"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeInTime($query)
    {
        return $query->where($this->tableCol('created_at'), '>=', now()->subHours(config('cms.password_reset_duration')));
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
        return $this->belongsTo(User::class);
    }
}
