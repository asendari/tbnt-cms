<?php

/**
 * Convert object to array
 *
 * @param object $d Object input
 * @return array
 */
function object_to_array(object $d)
{
    if (is_array($d) === false && is_object($d) === false) {
        return [];
    }
    if (is_object($d) === true) {
        $d = get_object_vars($d);
    }

    return is_array($d) === true ? array_map(__FUNCTION__, $d) : $d;
}

/**
 * Merge objects
 *
 * @return object
 */
function object_merge()
{
    $args = func_get_args();
    $obj = [];

    foreach ($args as $arg) {
        try {
            $obj = array_replace_recursive($obj, object_to_array($arg));
        } catch (Exception $e) {
            continue;
        }
    }

    return array_to_object($obj);
}
