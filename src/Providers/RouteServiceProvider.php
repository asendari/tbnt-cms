<?php

namespace Tbnt\Cms\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = \Tbnt\Cms\Http\Controllers::class;

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->routesPatterns();

        $this->expliciteBindings();

        $this->loadRoutes();
    }

    /**
     * Define the patterns routes for the application.
     *
     * @return void
     */
    protected function routesPatterns()
    {
        $id_pattern = '[0-9]+';
        $uuid_pattern = '[a-z0-9]{8}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{12}';
        $escape_pattern = array_merge(['cms', 'cron', 'test'], config('cms.escape_patterns'));

        Route::pattern('path', '^(?!' . implode('|', $escape_pattern) . '\/?)[\/\w\.-]*?');
        Route::pattern(
            'langCode',
            implode(
                '|',
                collect(lang()->allWithoutHidden())
                    ->pluck('code')
                    ->toArray()
            )
        );

        Route::pattern('countryId', $id_pattern);
        Route::pattern('postId', $uuid_pattern);
        Route::pattern('postType', '(?!create\/?)[a-z\-]+');
        Route::pattern('postTypeId', $uuid_pattern);
        Route::pattern('userId', $id_pattern);
    }

    /**
     * Define the "base" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function expliciteBindings()
    {
        Route::model('countryId', \Tbnt\Cms\Model\Country::class);
        Route::model('postId', \Tbnt\Cms\Model\Post::class);
        Route::model('postTypeId', \Tbnt\Cms\Model\PostType::class);
        Route::model('userId', \Tbnt\Cms\Model\User::class);

        Route::bind('postType', function ($value) {
            return \Tbnt\Cms\Model\PostType::where('type', $value)->firstOrFail();
        });
    }

    /**
     * Register routes bindings in the container.
     *
     * @return void
     */
    public function loadRoutes()
    {
        if (config('cms.test') === true) {
            $this->loadTestRoutes();
        }

        if (config('cms.cron') === true) {
            $this->loadCronRoutes();
        }

        $this->loadApiRoutes();
        $this->loadAdminRoutes();
        $this->loadWebRoutes();
    }

    /**
     * Register routes bindings in the container.
     *
     * @return void
     */
    public function loadWebRoutes()
    {
        Route::middleware(['web', 'cms.group.web'])
            ->namespace($this->namespace . '\Web')
            ->group(__DIR__ . '/../../routes/web.php');
    }

    /**
     * Register routes bindings in the container.
     *
     * @return void
     */
    public function loadAdminRoutes()
    {
        Route::prefix(config('cms.admin_base'))
            ->middleware(['web', 'cms.group.admin'])
            ->namespace($this->namespace . '\Admin')
            ->group(__DIR__ . '/../../routes/admin.php');
    }

    /**
     * Register routes bindings in the container.
     *
     * @return void
     */
    public function loadApiRoutes()
    {
        Route::prefix('cms')
            ->middleware(['api'])
            ->namespace($this->namespace . '\Api')
            ->group(__DIR__ . '/../../routes/cms.php');
    }

    /**
     * Register routes bindings in the container.
     *
     * @return void
     */
    public function loadCronRoutes()
    {
        Route::prefix('cron')
            ->middleware(['web', 'cms.group.cron'])
            ->namespace($this->namespace . '\Cron')
            ->group(__DIR__ . '/../../routes/cron.php');
    }

    /**
     * Register routes bindings in the container.
     *
     * @return void
     */
    public function loadTestRoutes()
    {
        Route::prefix('test')
            ->middleware(['web', 'cms.group.test'])
            ->namespace($this->namespace . '\Test')
            ->group(__DIR__ . '/../../routes/test.php');
    }
}
