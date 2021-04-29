<?php

namespace Tbnt\Cms\Http\Middleware\Admin;

use Closure;
use Illuminate\Http\Request;

class LangMiddleware
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
        lang()->setCurrent('fr');

        return $next($request);
    }
}
