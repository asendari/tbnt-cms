<?php

namespace Tbnt\Cms\Exceptions;

class ValidateException extends BaseException
{
    /**
     * The message to use for the response.
     *
     * @var string
     */
    public $message = 'validate';

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public $status = 422;

    /**
     * Format the errors to be used for the response.
     *
     * @param mixed $error
     * @return mixed
     */
    public function formatError($error)
    {
        return is_array($error) === true
            ? array_map(function ($err) {
                return $this->formatError($err);
            }, $error)
            : (str()->startsWith($error, 'validation.') === true
                ? __('cms::' . $error)
                : $error);
    }
}
