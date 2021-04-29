<?php

namespace Tbnt\Cms\Utils;

class ObjectFunctionUtils
{
    /**
     * Class name
     *
     * @var string
     */
    public $class_name = null;

    /**
     * Create a new instance
     *
     * @param $class_name
     */
    public function __construct($class_name)
    {
        $this->class_name = $class_name;
    }

    /**
     * Called when an undefined or inaccessible method is called
     *
     * @param $funName
     * @param $arguments
     * @return mixed
     */
    public function __call($funName, $arguments)
    {
        return $this->class_name::$funName(...$arguments);
    }
}
