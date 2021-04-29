<?php

namespace Tbnt\Cms\Providers;

use App\Http\Middleware\EncryptCookies;
use Barryvdh\Cors\HandleCors;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;

class MiddlewareServiceProvider extends ServiceProvider
{
    /**
     * All of the short-hand keys for middlewares.
     *
     * @var array
     */
    protected $middleware = [
        'cms.admin.lang' => \Tbnt\Cms\Http\Middleware\Admin\LangMiddleware::class,
        'cms.admin.superadmin' => \Tbnt\Cms\Http\Middleware\Admin\SuperadminMiddleware::class,
        'cms.admin.type' => \Tbnt\Cms\Http\Middleware\Admin\TypeMiddleware::class,
        'cms.auth' => \Tbnt\Cms\Http\Middleware\AuthMiddleware::class,
        'cms.backup' => \Tbnt\Cms\Http\Middleware\BackupMiddleware::class,
        'cms.cron.type' => \Tbnt\Cms\Http\Middleware\Cron\TypeMiddleware::class,
        'cms.lang' => \Tbnt\Cms\Http\Middleware\LangMiddleware::class,
        'cms.local' => \Tbnt\Cms\Http\Middleware\LocalMiddleware::class,
        'cms.upload' => \Tbnt\Cms\Http\Middleware\ValidateFileUploadMiddleware::class,
        'cms.web.lang' => \Tbnt\Cms\Http\Middleware\Web\LangMiddleware::class,
        'cms.web.type' => \Tbnt\Cms\Http\Middleware\Web\TypeMiddleware::class,
    ];

    /**
     * Register bindings in the container.
     *
     * @param Router $router
     * @return void
     * @throws BindingResolutionException
     */
    public function boot(Router $router)
    {
        foreach ($this->middleware as $name => $class) {
            $router->aliasMiddleware($name, $class);
        }

        $kernel = $this->app->make('Illuminate\Contracts\Http\Kernel');
        $kernel->pushMiddleware(HandleCors::class);
        $kernel->pushMiddleware(\Tbnt\Cms\Http\Middleware\LangMiddleware::class);
        $kernel->pushMiddleware(\Tbnt\Cms\Http\Middleware\ValidateFileUploadMiddleware::class);

        $router->pushMiddlewareToGroup('api', EncryptCookies::class);
        $router->pushMiddlewareToGroup('api', AddQueuedCookiesToResponse::class);

        $router->pushMiddlewareToGroup('cms.group.web', 'cms.web.lang');
        $router->pushMiddlewareToGroup('cms.group.web', 'cms.upload');

        $router->pushMiddlewareToGroup('cms.group.admin', 'cms.admin.lang');
        $router->pushMiddlewareToGroup('cms.group.admin', 'cms.upload');

        $router->pushMiddlewareToGroup('cms.group.api.web', 'cms.lang');
        $router->pushMiddlewareToGroup('cms.group.api.web', 'cms.upload');

        $router->pushMiddlewareToGroup('cms.group.api.admin', 'cms.admin.lang');
        $router->pushMiddlewareToGroup('cms.group.api.admin', 'cms.upload');

        $router->pushMiddlewareToGroup('cms.group.cron', 'auth.basic:cron');
        $router->pushMiddlewareToGroup('cms.group.cron', 'cms.cron.type');
        $router->pushMiddlewareToGroup('cms.group.cron', 'cms.lang');
        $router->pushMiddlewareToGroup('cms.group.cron', 'cms.upload');

        $router->pushMiddlewareToGroup('cms.group.test', 'cms.local');
        $router->pushMiddlewareToGroup('cms.group.test', 'cms.lang');
        $router->pushMiddlewareToGroup('cms.group.test', 'cms.upload');
    }
}
