<?php

namespace Tbnt\Cms\Model\Vendor;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation as BaseRelation;

abstract class Relation extends BaseRelation
{
    /**
     * Get the name of the "where in" method for eager loading.
     *
     * @param Model $model
     * @param string $key
     * @return string
     */
    protected function whereInMethod(Model $model, $key)
    {
        $column = last(explode('.', $key));
        $subparts = explode('_', $column);

        return $model->getKeyName() === $column &&
            (in_array($model->getKeyType(), ['int', 'integer']) || (head($subparts) === 'post' && last($subparts) === 'id'))
            ? 'whereIntegerInRaw'
            : 'whereIn';
    }
}
