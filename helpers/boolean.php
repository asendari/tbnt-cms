<?php

/**
 * Check boolean value
 *
 * @param mixed $value Value to check
 * @return bool
 */
function to_bool($value)
{
    return $value === true || $value === 'true' || $value === 1 || $value === '1';
}
