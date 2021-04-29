<?php

namespace Tbnt\Cms\Exceptions;

class AuthenticationException extends BaseException
{
    /**
     * The message to use for the response.
     *
     * @var string
     */
    public $message = 'unauthorized';

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public $status = 401;

    /**
     * Format the errors to be used for the response.
     *
     * @return mixed
     */
    public function formatErrors()
    {
        return parent::formatErrors();

        // return (app(Tbnt\Cms\Http\Controllers\AuthController::class)->getUserFromToken()->id ?? null) === null
        //     ? ['user_not_exists' => __('cms::validation.user_not_exists')]
        //     : ['unauthenticated' => __('cms::validation.user_not_exists')];
    }
}
