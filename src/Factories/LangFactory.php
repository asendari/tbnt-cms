<?php

namespace Tbnt\Cms\Factory;

use Illuminate\Database\Eloquent\Factory;
use Tbnt\Cms\Model\Lang;

/**
 * @var Factory $factory
 */

$factory->define(Lang::class, function () {
    return [
        'id' => 0,
        'code' => '',
        'name' => '',
        'locale' => '',
        'emoji' => '',
        'img' => '',
    ];
});
