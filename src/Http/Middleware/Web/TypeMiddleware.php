<?php

namespace Tbnt\Cms\Http\Middleware\Web;

use Closure;
use Illuminate\Http\Request;

class TypeMiddleware
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
        return auth()
            ->user()
            ->isTypeWeb() === true
            ? $next($request)
            : abort(403);
    }
}
