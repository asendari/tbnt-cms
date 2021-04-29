<?php

namespace Tbnt\Cms\Model;

use Hash;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Laravel\Passport\Client;
use Laravel\Passport\HasApiTokens;
use Laravel\Passport\Token;

/**
 * Tbnt\Cms\Model\User
 *
 * @property int $id
 * @property int $user_type_id
 * @property int|null $lang_id
 * @property string $username
 * @property string $password
 * @property string|null $remember_token
 * @property bool $is_active
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $last_login_at
 * @property Carbon|null $last_connected_at
 * @property Carbon|null $deleted_at
 * @property-read Collection|Client[] $clients
 * @property-read int|null $clients_count
 * @property-read UserAdmin|UserCron|UserType|UserWeb|null $profile
 * @property-read Collection|UserPasswordReset[] $password_resets
 * @property-read int|null $password_resets_count
 * @property-read Collection|Token[] $tokens
 * @property-read int|null $tokens_count
 * @property-read UserAdmin|null $user_admin
 * @property-read UserCron|null $user_cron
 * @property-read UserType $user_type
 * @property-read UserWeb|null $user_web
 * @method static Builder|User hasSearch($searches)
 * @method static Builder|User isActive($is_active = true)
 * @method static Builder|User isAdmin()
 * @method static Builder|User isCron()
 * @method static Builder|User isLangId($lang_id)
 * @method static Builder|User isOrdered($order)
 * @method static Builder|User isType($type)
 * @method static Builder|User isWeb()
 * @method static \Illuminate\Database\Query\Builder|User onlyTrashed()
 * @method static Builder|User whereCreatedAt($value)
 * @method static Builder|User whereDeletedAt($value)
 * @method static Builder|User whereId($value)
 * @method static Builder|User whereIsActive($value)
 * @method static Builder|User whereLangId($value)
 * @method static Builder|User whereLastConnectedAt($value)
 * @method static Builder|User whereLastLoginAt($value)
 * @method static Builder|User wherePassword($value)
 * @method static Builder|User whereRememberToken($value)
 * @method static Builder|User whereUpdatedAt($value)
 * @method static Builder|User whereUserTypeId($value)
 * @method static Builder|User whereUsername($value)
 * @method static \Illuminate\Database\Query\Builder|User withTrashed()
 * @method static \Illuminate\Database\Query\Builder|User withoutTrashed()
 */
class User extends BaseAuthenticable
{
    use SoftDeletes, HasApiTokens;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that aren't mass assignable
     *
     * @var array
     */
    protected $guarded = ['password', 'remember_token'];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['last_login_at', 'last_connected_at'];

    /**
     * The attributes that should be hidden for arrays
     * When hiding relationships, use the relationship's method name
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token'];

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
     * Scope "isLangId"
     *
     * @param Builder|static $query
     * @param int $lang_id Lang id
     * @return Builder|static
     */
    public function scopeIsLangId($query, int $lang_id)
    {
        return $query->where($this->tableCol('lang_id'), intval($lang_id));
    }

    /**
     * Scope "isActive"
     *
     * @param Builder|static $query
     * @param bool $is_active Is active
     * @return Builder|static
     */
    public function scopeIsActive($query, $is_active = true)
    {
        return $query->where($this->tableCol('is_active'), intval($is_active));
    }

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
     * @param string|array $searches Search string
     * @return Builder|static
     */
    public function scopeHasSearch($query, $searches)
    {
        return $query->search(['username'], $searches);
    }

    /**
     * Scope "isType"
     *
     * @param Builder|static $query
     * @param int|string|array $type Type
     * @return Builder|static
     */
    public function scopeIsType($query, $type)
    {
        return $query->whereHas('user_type', function ($query) use ($type) {
            return $query->isType($type);
        });
    }

    /**
     * Scope "isAdmin"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeIsAdmin($query)
    {
        return $query->isType(UserType::ADMIN);
    }

    /**
     * Scope "isCron"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeIsCron($query)
    {
        return $query->isType(UserType::CRON);
    }

    /**
     * Scope "isWeb"
     *
     * @param Builder|static $query
     * @return Builder|static
     */
    public function scopeIsWeb($query)
    {
        return $query->isType(UserType::WEB);
    }

    /****************************************************************
     * Attributes
     ***************************************************************/

    /**
     * Get "profile" attribute
     *
     * @return UserAdmin|UserCron|UserType|UserWeb|null
     */
    public function getProfileAttribute()
    {
        return $this->isTypeAdmin() === true
            ? $this->user_admin
            : ($this->isTypeCron() === true
                ? $this->user_cron
                : ($this->isTypeWeb() === true
                    ? $this->user_web
                    : null));
    }

    /****************************************************************
     * Mutators
     ***************************************************************/

    /**
     * Set "password" attribute
     *
     * @param string $value
     * @return void
     */
    public function setPasswordAttribute(string $value)
    {
        $this->attributes['password'] = $value ? Hash::make($value) : '';
    }

    /**
     * Set "last_login_at" attribute
     *
     * @param string $value
     * @return void
     */
    public function setLastLoginAtAttribute(string $value)
    {
        $this->attributes['last_login_at'] = to_datetime_utc_string($value);
    }

    /**
     * Set "last_connected_at" attribute
     *
     * @param string $value
     * @return void
     */
    public function setLastConnectedAtAttribute(string $value)
    {
        $this->attributes['last_connected_at'] = to_datetime_utc_string($value);
    }

    /****************************************************************
     * Relations
     ***************************************************************/

    /**
     * User type relation
     *
     * @return BelongsTo|UserType
     */
    public function user_type()
    {
        return $this->belongsTo(UserType::class, 'user_type_id', 'id');
    }

    /**
     * User admin relation
     *
     * @return HasOne|UserAdmin
     */
    public function user_admin()
    {
        return $this->hasOne(UserAdmin::class, 'user_id', 'id');
    }

    /**
     * User cron relation
     *
     * @return HasOne|UserCron
     */
    public function user_cron()
    {
        return $this->hasOne(UserCron::class, 'user_id', 'id');
    }

    /**
     * User web relation
     *
     * @return HasOne|UserWeb
     */
    public function user_web()
    {
        return $this->hasOne(UserWeb::class, 'user_id', 'id');
    }

    /**
     * Password resets relations
     *
     * @return HasMany|Collection|UserPasswordReset[]
     */
    public function password_resets()
    {
        return $this->hasMany(UserPasswordReset::class, 'user_id', 'id');
    }

    /****************************************************************
     * Object
     ***************************************************************/

    /**
     * Check if user is type
     *
     * @param string $type
     * @return bool
     */
    public function hasType(string $type)
    {
        return $this->user_type->key === $type;
    }

    /**
     * Check if user is admin
     *
     * @return bool
     */
    public function isTypeAdmin()
    {
        return $this->hasType(UserType::ADMIN);
    }

    /**
     * Check if user is cron
     *
     * @return bool
     */
    public function isTypeCron()
    {
        return $this->hasType(UserType::CRON);
    }

    /**
     * Check if user is web
     *
     * @return bool
     */
    public function isTypeWeb()
    {
        return $this->hasType(UserType::WEB);
    }

    /**
     * Get uploads directory
     *
     * @return string
     */
    public function getUploadDir()
    {
        return 'users/' . $this->id;
    }

    /**
     * Find user for passport
     *
     * @param string $username Username
     * @return User
     */
    public function findForPassport(string $username)
    {
        return $this->where('username', $username)->first();
    }

    /**
     * Update is active
     *
     * @param int|bool $is_active Is active
     * @return void
     */
    public function setActive($is_active)
    {
        $this->updateEntry('is_active', intval($is_active));
    }

    /**
     * Update username
     *
     * @param string $username Username
     * @return void
     */
    public function updateUsername(string $username)
    {
        $this->updateEntry('username', $username);
    }

    /**
     * Update password
     *
     * @param string $password Password
     * @return void
     */
    public function updatePassword(string $password)
    {
        $this->updateEntry('password', $password);
    }

    /**
     * Update last login at
     *
     * @param string|null $last_login_at Last login date
     * @return void
     */
    public function updateLastLoginAt($last_login_at = null)
    {
        $this->updateEntry('last_login_at', $last_login_at ?: now());
    }

    /**
     * Update last connected at
     *
     * @param string|null $last_connected_at Last connected date
     * @return void
     */
    public function updateLastConnectedAt($last_connected_at = null)
    {
        $this->updateEntry('last_connected_at', $last_connected_at ?: now());
    }

    /**
     * Update last login at and last connected at
     *
     * @param string|null $last_auth_at Last auth date
     * @return void
     */
    public function updateLastAuthAt($last_auth_at = null)
    {
        $last_auth_at = $last_auth_at ?: now();

        $this->updateEntries(['last_login_at' => $last_auth_at, 'last_connected_at' => $last_auth_at]);
    }

    /**
     * Update data
     *
     * @param array $data Data
     * @return void
     */
    public function updateData(array $data)
    {
        if (isset($data['lang_id']) === true) {
            $data['lang_id'] = lang()->exists($data['lang_id']) ? $data['lang_id'] : lang()->getDefaultId();
        }

        $this->updateEntries($data, ['lang_id']);
    }

    /**
     * Generate password
     *
     * @return string
     */
    public function generatePassword()
    {
        return str()->random(14);
    }

    /**
     * Generate new reset password token
     *
     * @return string
     */
    public function generateResetPasswordToken()
    {
        $new_token = generate_hash();

        $this->password_resets()->create(['token' => $new_token]);

        return $new_token;
    }

    /**
     * Check reset password token
     *
     * @param string $token Reset token
     * @return bool
     */
    public function checkResetPasswordToken(string $token)
    {
        return in_array(
            $token,
            arr()->pluck(
                $this->password_resets()
                    ->inTime()
                    ->get(),
                'token'
            )
        );
    }
}
