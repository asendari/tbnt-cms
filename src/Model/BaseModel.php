<?php

namespace Tbnt\Cms\Model;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Tbnt\Cms\Model\Traits\BaseTrait;

/**
 * Tbnt\Cms\Model\BaseModel
 *
 * @method static Builder|BaseModel isBefore($created_at = null)
 * @method static Builder|BaseModel keyId($value, $string = null, $numeric = null)
 * @method static Builder|BaseModel keyIdNot($value, $string = null, $numeric = null)
 * @method static Builder|BaseModel like($fields, $search)
 * @method static Builder|BaseModel newModelQuery()
 * @method static Builder|BaseModel newQuery()
 * @method static Builder|BaseModel orLike($fields, $search)
 * @method static Builder|BaseModel query()
 * @method static Builder|BaseModel search($fields, $searches, $multiple = true)
 * @method static Builder|BaseModel within($value, $column = null)
 * @method static Builder|BaseModel withinKey($value, $column = null)
 * @method static Builder|BaseModel withinKeyNot($value, $column = null)
 * @method static Builder|BaseModel withinNot($value, $column = null)
 * @mixin Eloquent
 */
class BaseModel extends Model
{
    use BaseTrait;
}
