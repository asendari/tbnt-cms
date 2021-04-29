<?php

/**
 * Make ordinal number
 *
 * @param int $number Number input
 * @return string
 */
function ordinal(int $number)
{
    $ends = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];

    if ($number % 100 >= 11 && $number % 100 <= 13) {
        return $number . 'th';
    }

    return $number . $ends[$number % 10];
}

/**
 * Make number numeric
 *
 * @param mixed $number Number input
 * @return mixed
 */
function numeric_val($number)
{
    try {
        return $number + 0;
    } catch (Exception $e) {
        return $number == (int) $number ? intval($number) : floatval($number);
    }
}

/**
 * Round decimal number
 *
 * @param float $number Number input
 * @param int $decimal Decimal to round
 * @param int $round Decimal to round to
 * @param bool $direction Round up (true) or down (false: default)
 * @return mixed
 */
function round_decimal(float $number, $decimal = 2, $round = 10, $direction = false)
{
    $floor = floor($number);
    $pow = pow(10, $decimal);
    $rounded = ($number - $floor) * $pow;

    return $floor + ($direction === true ? ceil($rounded / $round) * $round : floor($rounded / $round) * $round) / $pow;
}
