<?php

namespace Tbnt\Cms\Model;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Query\Builder;

/**
 * Tbnt\Cms\Model\BaseModelPost
 *
 * @method static Builder|BaseModelPost onlyTrashed()
 * @method static Builder|BaseModelPost withTrashed()
 * @method static Builder|BaseModelPost withoutTrashed()
 */
class BaseModelPost extends BaseModelUuid
{
    use SoftDeletes;
}
