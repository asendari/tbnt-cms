<?php

use Symfony\Component\VarDumper\VarDumper;
use Tbnt\Cms\Utils\DebugUtils;

/**
 * Return new UtilsDebug instance
 *
 * @return object
 */
function app_debug()
{
    return new DebugUtils();
}

/**
 * Output dd() without die
 *
 * @return void
 */
function dd_continue()
{
    if (PHP_SAPI !== 'cli') {
        echo '<style>' .
            '.sf-dump { font-size: 10px !important; }' .
            '.sf-dump .sf-dump-compact { display: inline !important; font-size: inherit!important; font-family: inherit!important; color: inherit!important; white-space: inherit!important; padding: inherit!important; background: inherit!important; }' .
            '</style>';
    }

    array_map(function ($x) {
        (new VarDumper())->dump($x);
    }, func_get_args());
}

/**
 * Output print_r
 *
 * @return void
 */
function pp_continue()
{
    echo '<pre>';
    array_map('print_r', func_get_args());
    echo '</pre>';
}

/**
 * Output print_r and die
 *
 * @return void
 */
function pp()
{
    pp_continue(func_get_args());

    die();
}

/**
 * Output var_dump
 *
 * @return void
 */
function vv_continue()
{
    array_map('var_dump', func_get_args());
}

/**
 * Output var_dump and die
 *
 * @return void
 */
function vv()
{
    vv_continue(func_get_args());

    die();
}
