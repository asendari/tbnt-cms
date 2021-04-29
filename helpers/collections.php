<?php

use Illuminate\Support\Collection;

/**
 * Check if value is Laravel Collection
 *
 * @param mixed $d Value to check
 * @return bool
 */
function is_laravel_collection($d)
{
    return is_object($d) === true && get_parent_class($d) === Collection::class;
}
