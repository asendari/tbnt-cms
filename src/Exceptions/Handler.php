<?php

namespace Tbnt\Cms\Exceptions;

use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use League\OAuth2\Server\Exception\OAuthServerException;

class Handler extends ExceptionHandler
{
    /**
     * Get the default context variables for logging.
     *
     * @return array
     */
    protected function context()
    {
        return array_merge(parent::context(), ['request' => request()->server()]);
    }

    /**
     * Report or log an exception.
     *
     * @param Exception $exception
     * @return void
     * @throws Exception
     */
    public function report(Exception $exception)
    {
        // Handle OAuthServer exception
        if (
            $exception instanceof OAuthServerException ||
            $exception instanceof \Laravel\Passport\Exceptions\OAuthServerException
        ) {
            // 2 = unsupportedGrantType: The authorization grant type is not supported by the authorization server
            // 3 = invalidRequest: The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed
            // 4 = invalidClient: Client authentication failed
            // 5 = invalidScope: The requested scope is invalid, unknown, or malformed
            // 6 = invalidCredentials: The user credentials were incorrect
            // 7 = serverError: The authorization server encountered an unexpected condition which prevented it from fulfilling the request
            // 8 = invalidRefreshToken: The refresh token is invalid
            // 9 = accessDenied: The resource owner or authorization server denied the request
            // 10 = invalidGrant: The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client

            if (in_array($exception->getCode(), [6, 8, 9, 10]) === true) {
                return;
            }
        }

        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param Request $request
     * @param Exception $exception
     * @return Response
     * @throws Exception
     */
    public function render($request, Exception $exception)
    {
        // Handle Http Exceptions
        if ($exception instanceof \Symfony\Component\HttpKernel\Exception\HttpException) {
            return HttpException::renderException($exception, $request);
        }

        // Handle Authorization exception
        elseif ($exception instanceof AuthorizationException) {
            return ForbiddenException::renderException($exception, $request);
        }

        // Handle TokenMismatch exception
        elseif ($exception instanceof \Illuminate\Session\TokenMismatchException) {
            return TokenMismatchException::renderException($exception, $request);
        }

        // Handle Validation exception
        elseif ($exception instanceof ValidationException) {
            return ValidateException::renderException($exception, $request);
        }

        // Handle Authentication exception
        elseif ($exception instanceof \Illuminate\Auth\AuthenticationException) {
            return AuthenticationException::renderException($exception, $request);
        } elseif ($exception instanceof OAuthServerException) {
            return AuthenticationException::renderException($exception, $request);
        } elseif ($exception instanceof \Laravel\Passport\Exceptions\OAuthServerException) {
            return AuthenticationException::renderException($exception, $request);
        }

        // Handle any other non-custom exception
        elseif ($exception instanceof BaseException === false) {
            return BaseException::renderException($exception, $request);
        }

        return parent::render($request, $exception);
    }
}
