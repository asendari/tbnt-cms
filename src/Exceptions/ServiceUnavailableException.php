<?php

namespace Tbnt\Cms\Exceptions;

class ServiceUnavailableException extends BaseException
{
    /**
     * The message to use for the response.
     *
     * @var string
     */
    public $message = 'service_unavailable';

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public $status = 503;
}
