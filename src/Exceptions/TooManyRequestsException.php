<?php

namespace Tbnt\Cms\Exceptions;

class TooManyRequestsException extends BaseException
{
    /**
     * The message to use for the response.
     *
     * @var string
     */
    public $message = 'too_many_requests';

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public $status = 429;
}
