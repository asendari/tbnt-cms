<?php

namespace Tbnt\Cms\Exceptions;

class PageNotFoundException extends BaseException
{
    /**
     * The message to use for the response.
     *
     * @var string
     */
    public $message = 'page_not_found';

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public $status = 404;
}
