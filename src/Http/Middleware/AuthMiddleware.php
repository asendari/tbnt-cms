<?php

namespace Tbnt\Cms\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @param string ...$guards
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$guards)
    {
        if (auth()->user() === null) {
            $this->authenticate($guards);
        }

        return $next($request);
    }

    /**
     * Determine if the user is logged in to any of the given guards.
     *
     * @param string[] $guards
     * @return void
     */
    protected function authenticate(array $guards)
    {
        try {
            if (empty($guards)) {
                return auth()->authenticate();
            }

            foreach ($guards as $guard) {
                if (
                    auth()
                        ->guard($guard)
                        ->check()
                ) {
                    return auth()->shouldUse($guard);
                }
            }
        } catch (\Exception $e) {
        }
    }
}
