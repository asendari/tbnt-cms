<?php

namespace Tbnt\Cms\Exceptions;

class BadGatewayException extends BaseException
{
    /**
     * The message to use for the response.
     *
     * @var string
     */
    public $message = 'bad_gateway';

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public $status = 502;
}
