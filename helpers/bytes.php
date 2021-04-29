<?php

/**
 * Return val in bytes
 *
 * @param string $val
 * @return bool
 */
function return_bytes(string $val)
{
    $val = trim($val);
    $last = strtolower($val[strlen($val) - 1]);
    $val = substr($val, 0, -1);

    switch ($last) {
        case 'g':
            return $val * 1024 * 1024 * 1024;
        case 'm':
            return $val * 1024 * 1024;
        case 'k':
            return $val * 1024;
        default:
            break;
    }

    return $val;
}
