<?php

namespace Tbnt\Cms\Exceptions;

class RequestTimeoutException extends BaseException
{
    /**
     * The message to use for the response.
     *
     * @var string
     */
    public $message = 'request_timeout';

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public $status = 408;
}
