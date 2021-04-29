<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;

/**
 * Tbnt\Cms\Model\UserAdmin
 *
 * @property int $id
 * @property int $user_id
 * @property bool $is_superadmin
 * @property-read User $user
 * @method static Builder|UserAdmin isSuperadmin($is_superadmin = true)
 * @method static Builder|UserAdmin whereId($value)
 * @method static Builder|UserAdmin whereIsSuperadmin($value)
 * @method static Builder|UserAdmin whereUserId($value)
 */
class UserAdmin extends UserProfile
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_admins';

    /**
     * The attributes that should be cast to native types
     *
     * Possible values:
     * integer, real, float, double, string, boolean, object, array, collection, date, datetime, timestamp
     *
     * @var array
     */
    protected $casts = [
        'is_superadmin' => 'boolean',
    ];

    /****************************************************************
     * Scopes
     ***************************************************************/

    /**
     * Scope "isSuperadmin"
     *
     * @param Builder|static $query
     * @param bool $is_superadmin Is superadmin
     * @return Builder|static
     */
    public function scopeIsSuperadmin($query, $is_superadmin = true)
    {
        return $query->where($this->tableCol('is_superadmin'), intval($is_superadmin));
    }

    /****************************************************************
     * Object
     ***************************************************************/

    /**
     * Update is superadmin
     *
     * @param int|bool $is_superadmin Is superadmin
     * @return void
     */
    public function setSuperadmin($is_superadmin)
    {
        $this->updateEntry('is_superadmin', intval($is_superadmin));
    }
}
