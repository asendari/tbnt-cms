<?php

namespace Tbnt\Cms\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Validator;

class ValidateFileUploadMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        Validator::make(
            ['files' => arr()->flatten($request->allFiles())],
            [
                'files' => 'array',
                'files.*' => 'file_valid',
            ]
        )->validate();

        return $next($request);
    }
}
