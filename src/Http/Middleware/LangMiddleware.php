<?php

namespace Tbnt\Cms\Http\Middleware;

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
        $lang_segment =
            $request->hasHeader('X-App-Lang') === true ? $request->header('X-App-Lang') : $request->query('app_lang', null);

        if (lang()->codeExists($lang_segment) === false) {
            $lang_segment = lang()->getDefaultCode();
        }

        lang()->setCurrent($lang_segment);

        return $next($request);
    }
}
