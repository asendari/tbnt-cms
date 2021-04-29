<?php

namespace Tbnt\Cms\Exceptions;

class PostTooLargeException extends BaseException
{
    /**
     * The message to use for the response.
     *
     * @var string
     */
    public $message = 'post_too_large';

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public $status = 413;
}
