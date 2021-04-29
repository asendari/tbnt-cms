<?php

use Illuminate\Support\Arr;
use Tbnt\Cms\Utils\ObjectFunctionLoaderUtils;

/**
 * Return Arr as an executable function with methods
 *
 * @return object
 */
function arr()
{
    return ObjectFunctionLoaderUtils::load(Arr::class);
}

/**
 * Init PHP array
 *
 * @param mixed $d Array to list
 * @param string|int|null $key Array key
 * @return array
 */
function to_array($d, $key = null)
{
    return is_array($d) === false ? [$key ?: 0 => $d] : $d;
}

/**
 * Rename keys
 *
 * @param array $d Array to rename keys
 * @param array $new_names New name (['old_name' => 'new_name'])
 * @param bool $destructive Replace if new name exists
 * @return array
 */
function array_rename_keys(array $d, array $new_names, $destructive = true)
{
    foreach ($new_names as $old_name => $new_name) {
        if (isset($d[$old_name]) === false) {
            continue;
        }

        if ($destructive === true || isset($d[$new_name]) === false) {
            $d[$new_name] = $d[$old_name];
            unset($d[$old_name]);
        }
    }

    return $d;
}

/**
 * Rename keys and return only new keys
 *
 * @param array $d Array to rename keys
 * @param array $new_names New name (['old_name' => 'new_name'])
 * @param bool $destructive Replace if new name exists
 * @return array
 */
function array_rename_keys_select(array $d, array $new_names, $destructive = true)
{
    return Arr::only(array_rename_keys($d, $new_names, $destructive), array_values($new_names));
}

/**
 * Convert array to object
 *
 * @param mixed $d Array to convert
 * @return object|null
 */
function array_to_object(array $d)
{
    return is_array($d) === false && is_object($d) === false ? null : json_decode(json_encode($d));
}

/**
 * Prefix array keys
 *
 * @param array $d Array input
 * @param array $prefix Prefix
 * @return array
 */
function array_prefix(array $d, array $prefix)
{
    return array_combine(
        array_map(function ($k) use ($prefix) {
            return $prefix . $k;
        }, array_keys($d)),
        $d
    );
}

/**
 * Set array keys with attribute value
 *
 * @param array $d Array input
 * @param string $attr Attribute
 * @return array
 */
function array_index(array $d, string $attr)
{
    return array_combine(Arr::pluck($d, $attr), $d);
}

/**
 * Is array filtered empty
 *
 * @param array $d Array input
 * @return bool
 */
function array_reduce_empty(array $d)
{
    return count(array_filter(Arr::flatten($d))) === 0;
}

/**
 * Filter array by key
 *
 * @param array $d Array input
 * @param array $k Array keys
 * @return array
 */
function array_filter_key(array $d, array $k)
{
    return array_intersect_key($d, array_flip($k));
}

/**
 * Drop portion of array
 *
 * @param array $d Array input
 * @param int $count Portion count
 * @param bool $right Remove from right
 * @return array
 */
function array_drop(array $d, $count = 1, $right = false)
{
    array_splice($d, $right === false ? 0 : count($d) - $count, $count);

    return $d;
}

/**
 * Drop portion of array from right
 * Note: shorthand of array_drop(..., ..., true)
 *
 * @param array $d Array input
 * @param int $count Portion count
 * @return array
 */
function array_drop_right(array $d, $count = 1)
{
    return array_drop($d, $count, true);
}

/**
 * Forget array values with iteration
 *
 * @param array $d Array input
 * @param string $a Attribute in dot notation
 * @return void
 */
function array_forget_dot(array &$d, string $a)
{
    if (is_string($a) === true) {
        $a = array_map(function ($attr) {
            return trim($attr, '.');
        }, explode('*', $a));
    }

    if (is_array($a) === false) {
        return;
    }

    if (count($a) > 1) {
        $n = array_shift($a);

        if (isset($d[$n]) === true) {
            foreach ($d[$n] as &$d_n) {
                array_forget_dot($d_n, $a);
            }
        }
    } else {
        Arr::forget($d, $a);
    }
}

/**
 * Sort array by key value
 *
 * @param array $d Array input
 * @param string $k Attribute
 * @return array
 */
function sort_by(array $d, string $k)
{
    return array_values(
        Arr::sort($d, function ($v) use ($k) {
            if (is_array($v) && isset($v[$k])) {
                return $v[$k];
            } elseif (is_object($v) && isset($v->{$k})) {
                return $v->{$k};
            }

            return $v;
        })
    );
}

/**
 * Sort array by key value natural
 *
 * @param array $d Array input
 * @param string $k Attribute
 * @return array
 */
function sort_by_nat(array $d, string $k)
{
    usort($d, function ($a, $b) use ($k) {
        if (is_array($a) && isset($a[$k])) {
            return strnatcmp($a[$k], $b[$k]);
        } elseif (is_object($a) && isset($a->{$k})) {
            return strnatcmp($a->{$k}, $b->{$k});
        }

        return strnatcmp($a, $b);
    });

    return $d;
}

/**
 * Sort array by key
 *
 * @param array $d Array input
 * @return array
 */
function order_keys(array $d)
{
    ksort($d);

    return $d;
}

/**
 * Sort array by key recursive
 *
 * @param array $d Array input
 * @param int $sort_flag
 * @return array
 */
function order_keys_recursive(array $d, $sort_flag = SORT_REGULAR)
{
    if (!is_array($d)) {
        return $d;
    }

    ksort($d, $sort_flag);

    foreach ($d as &$arr) {
        $arr = order_keys_recursive($arr, $sort_flag);
    }

    return $d;
}
