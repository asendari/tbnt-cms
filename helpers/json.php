<?php

/**
 * Stringify array with chars replacement
 *
 * @param array $d Array stringify
 * @return string
 */
function stringify(array $d)
{
    $escapers = ['\\', '/', "\"", "\n", "\r", "\t", "\x08", "\x0c", '\u0022'];
    $replacements = ['\\\\', '\\/', "\\\"", "\\n", "\\r", "\\t", "\\f", '\\b', "\\\\\""];

    return str_replace($escapers, $replacements, json_encode($d, JSON_HEX_QUOT | JSON_HEX_APOS));
}
