<?php

namespace Tbnt\Cms\Exceptions;

class ForbiddenException extends BaseException
{
    /**
     * The message to use for the response.
     *
     * @var string
     */
    public $message = 'forbidden';

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public $status = 403;
}
