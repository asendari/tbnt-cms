<?php

use Tbnt\Cms\Utils\LangUtils;
use Tbnt\Cms\Utils\ObjectFunctionLoaderUtils;

/**
 * Return LangUtils as an executable function with methods
 *
 * @return object
 */
function lang()
{
    return ObjectFunctionLoaderUtils::load(LangUtils::class);
}
