<?php

namespace Tbnt\Cms\Model;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * Tbnt\Cms\Model\BasePivot
 *
 * @method static Builder|static newModelQuery()
 * @method static Builder|static newQuery()
 * @method static Builder|static query()
 * @mixin Eloquent
 */
class BasePivot extends Pivot
{
    // ...
}
