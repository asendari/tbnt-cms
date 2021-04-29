<?php

/**
 * Get view() output
 *
 * @param string $view Blade template
 * @param array $data Blade data
 * @return string
 */
function get_view(string $view, $data = [])
{
    $view = (string) view($view, $data);
    $view = str_replace(["\n", "\t"], '', $view);

    return $view;
}
