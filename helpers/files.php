<?php

use Tbnt\Cms\Utils\FileUtils;
use Tbnt\Cms\Utils\ObjectFunctionLoaderUtils;

/**
 * Return FileUtils as an executable function with methods
 *
 * @return object
 */
function media()
{
    return ObjectFunctionLoaderUtils::load(FileUtils::class);
}

/**
 * Format files directory
 *
 * @param string $filepath Filepath to format
 * @return bool
 */
function media_exists(string $filepath)
{
    return media()->exists($filepath);
}

/**
 * Format files directory
 *
 * @param string $filepath Filepath to format
 * @return string
 */
function media_root(string $filepath)
{
    return media()->formatRoot($filepath);
}

/**
 * Format files directory
 *
 * @param string $filepath Filepath to format
 * @return string
 */
function media_base(string $filepath)
{
    return media()->formatBase($filepath);
}

/**
 * Format files directory
 *
 * @param string $filepath Filepath to format
 * @return string
 */
function media_local(string $filepath)
{
    return media()->formatLocal($filepath);
}

/**
 * Format files directory
 *
 * @param string $filepath Filepath to format
 * @return string
 */
function media_url(string $filepath)
{
    return media()->formatUrl($filepath);
}

/**
 * Format files directory
 *
 * @param string $filepath Filepath to format
 * @return bool
 */
function thumb_exists(string $filepath)
{
    return media_exists(media()->formatThumbDir($filepath));
}

/**
 * Format files directory
 *
 * @param string $filepath Filepath to format
 * @return string
 */
function thumb_root(string $filepath)
{
    return media_root(media()->formatThumbDir($filepath));
}

/**
 * Format files directory
 *
 * @param string $filepath Filepath to format
 * @return string
 */
function thumb_base(string $filepath)
{
    return media_base(media()->formatThumbDir($filepath));
}

/**
 * Format files directory
 *
 * @param string $filepath Filepath to format
 * @return string
 */
function thumb_local(string $filepath)
{
    return media_local(media()->formatThumbDir($filepath));
}

/**
 * Format files directory
 *
 * @param string $filepath Filepath to format
 * @return string
 */
function thumb_url(string $filepath)
{
    return media_url(media()->formatThumbDir($filepath));
}

/**
 * Create dir if not exists
 *
 * @param string $dir Directory path
 * @return void
 */
function init_dir(string $dir)
{
    if (is_dir($dir) === false && is_file($dir) === false) {
        mkdir($dir, 0755, true);
    }
}

/**
 * Delete dir recursive
 *
 * @param string $dir Directory path
 * @return void
 */
function recursive_rmdir(string $dir)
{
    if (is_dir($dir) === false) {
        return;
    }

    $objects = scandir($dir);

    foreach ($objects as $object) {
        if ($object !== '.' && $object !== '..') {
            if (is_dir($dir . '/' . $object)) {
                recursive_rmdir($dir . '/' . $object);
            } else {
                unlink($dir . '/' . $object);
            }
        }
    }

    rmdir($dir);
}
