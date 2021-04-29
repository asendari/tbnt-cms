<?php

namespace Tbnt\Cms\Exceptions;

class BadRequestException extends BaseException
{
    /**
     * The message to use for the response.
     *
     * @var string
     */
    public $message = 'bad_request';

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public $status = 400;
}
