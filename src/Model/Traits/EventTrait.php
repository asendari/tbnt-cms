<?php

namespace Tbnt\Cms\Model\Traits;

use Closure;
use Eloquent;

/**
 * Tbnt\Cms\Model\Traits\EventTrait
 *
 * @mixin Eloquent
 */
trait EventTrait
{
    /**
     * Register a loaded model event with the dispatcher.
     *
     * @param Closure|string $callback
     * @return void
     */
    public static function loaded($callback)
    {
        static::registerModelEvent('loaded', $callback);
    }

    /**
     * Get the observable event names.
     *
     * @return array
     */
    public function getObservableEvents()
    {
        return array_merge(static::getObservableEvents(), ['loaded']);
    }

    /**
     * Create a new model instance that is existing.
     *
     * @param array $attributes
     * @param string|null $connection
     * @return static
     */
    public function newFromBuilder($attributes = [], $connection = null)
    {
        $model = static::newFromBuilder($attributes, $connection);

        $model->fireModelEvent('loaded', false);

        return $model;
    }
}
