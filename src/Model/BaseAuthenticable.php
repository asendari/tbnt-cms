<?php

namespace Tbnt\Cms\Model;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\User as Authenticable;
use Tbnt\Cms\Model\Traits\BaseTrait;

/**
 * Tbnt\Cms\Model\BaseAuthenticable
 *
 * @method static Builder|BaseAuthenticable isBefore($created_at = null)
 * @method static Builder|BaseAuthenticable keyId($value, $string = null, $numeric = null)
 * @method static Builder|BaseAuthenticable keyIdNot($value, $string = null, $numeric = null)
 * @method static Builder|BaseAuthenticable like($fields, $search)
 * @method static Builder|BaseAuthenticable newModelQuery()
 * @method static Builder|BaseAuthenticable newQuery()
 * @method static Builder|BaseAuthenticable orLike($fields, $search)
 * @method static Builder|BaseAuthenticable query()
 * @method static Builder|BaseAuthenticable search($fields, $searches, $multiple = true)
 * @method static Builder|BaseAuthenticable within($value, $column = null)
 * @method static Builder|BaseAuthenticable withinKey($value, $column = null)
 * @method static Builder|BaseAuthenticable withinKeyNot($value, $column = null)
 * @method static Builder|BaseAuthenticable withinNot($value, $column = null)
 * @mixin Eloquent
 */
class BaseAuthenticable extends Authenticable
{
    use BaseTrait;
}
