<?php

namespace Tbnt\Cms\Utils;

class ObjectFunctionLoaderUtils
{
    /**
     * Initialized classes
     *
     * @var array
     */
    private static $classes = [];

    /**
     * Check if ObjectFunction has been loaded
     *
     * @param string $class_name
     * @return bool
     */
    public static function has(string $class_name)
    {
        return isset(self::$classes[$class_name]);
    }

    /**
     * Load ObjectFunctionUtils
     *
     * @param string $class_name
     * @return object
     */
    public static function load(string $class_name)
    {
        if (self::has($class_name) === false) {
            self::$classes[$class_name] = new ObjectFunctionUtils($class_name);
        }

        return self::$classes[$class_name];
    }
}
