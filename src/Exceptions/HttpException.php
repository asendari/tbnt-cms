<?php

namespace Tbnt\Cms\Exceptions;

use Exception;

class HttpException extends BaseException
{
    /**
     * The exceptions map by HTTP status code.
     *
     * @var array
     */
    protected static $exceptions_map = [
        400 => BadRequestException::class,
        401 => AuthenticationException::class,
        403 => ForbiddenException::class,
        404 => PageNotFoundException::class,
        405 => MethodNotAllowedException::class,
        408 => RequestTimeoutException::class,
        413 => PostTooLargeException::class,
        419 => TokenMismatchException::class,
        422 => ValidateException::class,
        429 => TooManyRequestsException::class,
        500 => ServerErrorException::class,
        502 => BadGatewayException::class,
        503 => ServiceUnavailableException::class,
    ];

    /**
     * Create a new exception instance from exception.
     *
     * @param \Symfony\Component\HttpKernel\Exception\HttpException|Exception $exception
     * @param int|null $status
     * @param mixed $errors
     * @return static
     */
    public static function fromException(Exception $exception, $status = null, $errors = null)
    {
        return (static::$exceptions_map[$exception->getStatusCode()] ?? Exception::class)::fromException($exception);
    }
}
