<?php

/**
 * Check if PHP is CLI
 *
 * @return bool
 */
function is_cli()
{
    return PHP_SAPI === 'cli';
}

/**
 * Check if IP is localhost
 *
 * @return bool
 */
function is_localhost()
{
    return Request::instance()->ip() === '::1';
}

/**
 * Check if IP is localhost
 *
 * @return bool
 */
function is_https()
{
    return isset($_SERVER['HTTPS']) === true && $_SERVER['HTTPS'] !== 'off';
}

/**
 * Get app name
 *
 * @param string $default Default app name
 * @return string
 */
function app_name($default = 'APP_NAME')
{
    return env('APP_NAME', $default);
}

/**
 * Laravel url() function but with http(s) and is_cli()
 * e.g: [protocol]://[current.domain][/current.folder?]/$url
 *
 * @param string $url Url to format
 * @return string
 */
function app_url($url = '')
{
    $url = trim(trim($url), '/');

    if (is_cli() === true) {
        return 'http://localhost' . $url;
    }
    if (is_https() === true) {
        return secure_url($url);
    }

    return url($url);
}

/**
 * Laravel url() function but with http(s) and is_cli()
 * e.g: [protocol]://[current.domain][/current.folder?]/$url
 *
 * @param string $url Url to format
 * @return string
 */
function public_url($url = '')
{
    return app_url(make_url([config('cms.public'), $url]));
}

/**
 * Get base url project
 * e.g: [current.folder]/$url
 *
 * @return string
 */
function base_url()
{
    return trim(preg_replace('#^[^:/.]*[:/]+' . Request::server('HTTP_HOST') . '#i', '', app_url()), '/');
}
