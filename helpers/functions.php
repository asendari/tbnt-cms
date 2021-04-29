<?php

/**
 * Safe filemtime
 *
 * @param string $file File
 * @return false|int
 */
function file_time_safe(string $file)
{
    if (file_exists($file) === false) {
        return false;
    }

    return filemtime($file);
}

/**
 * Safe filemtime
 *
 * @return bool
 */
function set_time_limit_safe()
{
    if (function_exists('set_time_limit') === false) {
        return false;
    }

    return set_time_limit(...func_get_args());
}
