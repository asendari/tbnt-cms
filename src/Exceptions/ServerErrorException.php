<?php

namespace Tbnt\Cms\Exceptions;

class ServerErrorException extends BaseException
{
    /**
     * The message to use for the response.
     *
     * @var string
     */
    public $message = 'server_error';

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public $status = 500;
}
