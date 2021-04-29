<?php

namespace Tbnt\Cms\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Tbnt\Cms\Utils\BackupUtils;

class BackupMiddleware
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
        try {
            if (config('cms.auto_backup')) {
                BackupUtils::backupTimeframes();
            }
        } catch (Exception $e) {
            // ...
        }

        return $next($request);
    }
}
