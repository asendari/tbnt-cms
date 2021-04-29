<?php

namespace Tbnt\Cms\Exceptions;

use Auth;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Log;

class BaseException extends Exception
{
    /**
     * The message to use for the response.
     *
     * @var string
     */
    public $message = 'Woops';

    /**
     * The status code to use for the response.
     *
     * @var int
     */
    public $status = 400;

    /**
     * The errors to use for the response.
     *
     * @var mixed
     */
    public $errors;

    /**
     * Create a new exception instance.
     *
     * @param string $message
     * @param mixed $errors
     * @param int|null $status
     */
    public function __construct($message = '', $errors = null, $status = null)
    {
        $this->message = $message ?: $this->message;
        $this->status = $status ?: $this->status;
        $this->errors = $errors;

        parent::__construct($this->message, $this->status);
    }

    /**
     * Set the message to be used for the response.
     *
     * @param string $message
     * @return $this
     */
    public function message(string $message)
    {
        $this->message = $message;

        return $this;
    }

    /**
     * Set the HTTP status code to be used for the response.
     *
     * @param int $status
     * @return $this
     */
    public function status(int $status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Format the message to be used for the response.
     *
     * @return string
     */
    public function formatMessage()
    {
        $trans_key = 'cms::errors.' . $this->message;
        $translation = __($trans_key);

        return $translation === $trans_key ? $this->message : $translation;
    }

    /**
     * Format the errors to be used for the response.
     *
     * @return mixed
     */
    public function formatErrors()
    {
        return $this->errors;
    }

    /**
     * Log the exception.
     *
     * @return void
     */
    public function log()
    {
        Log::error($this->getMessage(), [
            'userId' => Auth::id(),
            'request' => request()->server(),
            'exception' => $this,
        ]);
    }

    /**
     * Report the exception.
     *
     * @return void
     */
    public function report()
    {
    }

    /**
     * Render the exception into an HTTP response.
     *
     * @param Request $request
     * @return Response
     */
    public function render(Request $request)
    {
        $params = array_filter([
            'status' => $this->status,
            'message' => $this->formatMessage(),
            'errors' => $this->formatErrors(),
        ]);

        return $request->expectsJson() === true
            ? response($params, $this->status)
            : response()->view('cms::errors.exception', $params, $this->status);
    }

    /**
     * Create a new exception instance from exception.
     *
     * @param Exception $exception
     * @param int|null $status
     * @param mixed $errors
     * @return static
     */
    public static function fromException(Exception $exception, $status = null, $errors = null)
    {
        return new static(
            $exception->getMessage(),
            $errors ?: (method_exists($exception, 'errors') ? $exception->errors() : null),
            $status ?: (method_exists($exception, 'getStatusCode') ? $exception->getStatusCode() : null)
        );
    }

    /**
     * Report an exception instance from exception.
     *
     * @param Exception $exception
     * @param int|null $status
     * @param mixed $errors
     * @return void
     */
    public static function reportException(Exception $exception, $status = null, $errors = null)
    {
        self::fromException($exception, $status, $errors)->report();
    }

    /**
     * Render an exception instance from exception.
     *
     * @param Exception $exception
     * @param Request $request
     * @param int|null $status
     * @param mixed $errors
     * @return Response
     */
    public static function renderException(Exception $exception, Request $request, $status = null, $errors = null)
    {
        return static::fromException($exception, $status, $errors)->render($request);
    }
}
