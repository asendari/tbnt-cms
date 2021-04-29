<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Tbnt\Cms\Model\UserProfile
 *
 * @property-read User $user
 */
class UserProfile extends BaseModel
{
    /**
     * Indicates if the model should be timestamped.
     *
     * @var string
     */
    public $timestamps = false;

    /**
     * The attributes that aren't mass assignable
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * All of the relationships to be touched
     *
     * @var array
     */
    protected $touches = ['user'];

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
        return $this->belongsTo(User::class, 'user_id');
    }
}
