<?php

namespace Tbnt\Cms\Model\Vendor;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Query\Builder;

class QueryBuilderUnsafe extends Builder
{
    /**
     * Add a "where in" clause to the query.
     *
     * @param string $column
     * @param mixed $values
     * @param string $boolean
     * @param bool $not
     * @return $this
     */
    public function whereIn($column, $values, $boolean = 'and', $not = false)
    {
        $column = last(explode('.', $column));
        $subparts = explode('_', $column);

        if (in_array(head($subparts), ['post', 'id']) && last($subparts) === 'id') {
            return $this->whereStringInRaw($column, $values, $boolean, $not);
        }

        return parent::whereIn($column, $values, $boolean, $not);
    }

    /**
     * Add a "where in raw" clause for integer values to the query.
     *
     * @param string $column
     * @param Arrayable|array $values
     * @param string $boolean
     * @param bool $not
     * @return $this
     */
    public function whereStringInRaw(string $column, $values, $boolean = 'and', $not = false)
    {
        $type = $not ? 'NotInRaw' : 'InRaw';

        if ($values instanceof Arrayable) {
            $values = $values->toArray();
        }

        foreach ($values as &$value) {
            $value = "\"{$value}\"";
        }

        $this->wheres[] = compact('type', 'column', 'values', 'boolean');

        return $this;
    }
}
