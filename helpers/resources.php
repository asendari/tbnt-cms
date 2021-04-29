<?php

use Illuminate\Http\Resources\Json\Resource;

/**
 * Check if value is Laravel Resource
 *
 * @param mixed $d Value to check
 * @return bool
 */
function is_laravel_resource($d)
{
    return is_object($d) === true && get_parent_class($d) === Resource::class;
}
