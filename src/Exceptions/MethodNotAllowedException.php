<?php

namespace Tbnt\Cms\Exceptions;

class MethodNotAllowedException extends BaseException
{
    /**
     * The message to use for the response.
     *
     * @var string
     */
    public $message = 'method_not_allowed';

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public $status = 405;
}
