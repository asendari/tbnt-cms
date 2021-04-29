<?php

namespace Tbnt\Cms\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class LocalMiddleware
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
        return config('app.env') === 'local' ? $next($request) : abort(401);
    }
}
