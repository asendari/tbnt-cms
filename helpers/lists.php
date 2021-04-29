<?php

/**
 * Init PHP array for list
 *
 * @param array $d Array to list
 * @param int|null $count Count to list
 * @param mixed $replacement Replacement if overflow
 * @param bool $reverse List from the end
 * @return array
 */
function init_list(array $d, $count = null, $replacement = null, $reverse = false)
{
    $count = $count ?? count($d);

    return array_pad($d, $reverse ? 0 - $count : $count, $replacement);
}
