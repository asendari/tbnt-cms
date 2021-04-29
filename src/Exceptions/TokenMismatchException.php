<?php

namespace Tbnt\Cms\Exceptions;

class TokenMismatchException extends BaseException
{
    /**
     * The message to use for the response.
     *
     * @var string
     */
    public $message = 'token_mismatch';

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public $status = 419;
}
