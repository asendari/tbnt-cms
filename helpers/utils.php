<?php

use Illuminate\Support\Arr;
use Illuminate\Support\MessageBag;

/**
 * Init MessageBag with key -> message
 *
 * @param string $key Message key to add
 * @param string|array $message Message to add
 * @return MessageBag
 */
function message_bag($key = '', $message = '')
{
    $errors = new MessageBag();

    return $key === '' ? $errors : $errors->add($key, $message);
}

/**
 * Generate mailto: link
 * ex: <a mailto="$email" $data>$content</a>
 *
 * @param string $email Email address
 * @param string $content Link content text
 * @param array $data Link attributes
 * @return string
 */
function mailto(string $email, string $content, $data = [])
{
    return Html::mailto($email, $content, $data);
}

/**
 * Format url with slashes between parts
 *
 * @param string|array $parts URL parts
 * @return string
 */
function dir_separator($parts)
{
    $regex = '/^([a-z]+\:[\/]{2})|^([\/]{1,2})/';

    $parts = implode('/', Arr::flatten(to_array($parts)));
    $start = null;

    preg_match($regex, $parts, $start);

    $start = $start ? $start[0] ?? '' : '';
    $parts = preg_replace($regex, '', $parts);

    return $start .
        implode(
            '/',
            array_filter(array_map('trim', explode('/', $parts)), function ($part) {
                return (is_string($part) === true || is_numeric($part) === true) && blank($part) === false;
            })
        );
}

/**
 * Format url with slashes between parts
 *
 * @param string|array $parts URL parts
 * @param bool $suffix
 * @param bool $http
 * @return string
 */
function make_url($parts, $suffix = false, $http = false)
{
    $regex = '/^([a-z]+\:[\/]{1})/';

    $parts = implode('/', Arr::flatten(to_array($parts)));
    $start = null;

    preg_match($regex, $parts, $start);

    $start = $http === true ? ($start ? $start[0] ?? '' : '') : '';
    $parts = $http === false ? preg_replace($regex, '', $parts) : $parts;

    return $start .
        ($suffix === true || $http === true ? '/' : '') .
        implode(
            '/',
            array_filter(array_map('trim', explode('/', $parts)), function ($part) {
                return (is_string($part) === true || is_numeric($part) === true) && blank($part) === false;
            })
        );
}

/**
 * Format url with slashes between parts
 *
 * @param string $path
 * @param string $lang_code
 * @return string
 */
function clean_url_lang(string $path, $lang_code = '')
{
    return make_url(preg_replace('/^' . $lang_code . '\/?(.+)?/', '$1', trim($path, '/'))) ?: '/';
}
