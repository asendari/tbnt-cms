<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\Builder;

/**
 * Tbnt\Cms\Model\UserCron
 *
 * @property int $id
 * @property int $user_id
 * @property-read User $user
 * @method static Builder|UserCron whereId($value)
 * @method static Builder|UserCron whereUserId($value)
 */
class UserCron extends UserProfile
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_crons';
}
