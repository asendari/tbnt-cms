<?php

namespace Tbnt\Cms\Providers;

use File;
use Illuminate\Support\ServiceProvider;
use ZipArchive;

class PackageServiceProvider extends ServiceProvider
{
    /**
     * Register bindings in the container.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadFactories();
        $this->loadTranslations();
        $this->loadViews();

        if ($this->app->runningInConsole()) {
            $this->loadMigrations();

            $this->registerCommands();

            $this->publishEnv();
            $this->publishHtAccess();
            $this->publishConfig();
            $this->publishAssets();
            // $this->publishDocs();
            $this->publishMigrations();
            $this->publishTranslations();
            $this->publishViews();
        }
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->mergeConfigs();
    }

    /**
     * Register the migrations service provider.
     *
     * @return void
     */
    public function loadMigrations()
    {
        $this->loadMigrationsFrom(__DIR__ . '/../../migrations');
    }

    /**
     * Register the factories service provider.
     *
     * @return void
     */
    public function loadFactories()
    {
        $this->loadFactoriesFrom(__DIR__ . '/../Factories');
    }

    /**
     * Register the translations service provider.
     *
     * @return void
     */
    public function loadTranslations()
    {
        $this->loadTranslationsFrom(__DIR__ . '/../../translations', 'cms');
    }

    /**
     * Register the views service provider.
     *
     * @return void
     */
    public function loadViews()
    {
        $this->loadViewsFrom(__DIR__ . '/../../views', 'cms');
    }

    /**
     * Register the config service provider.
     *
     * @return void
     */
    public function mergeConfigs()
    {
        $this->mergeConfigWith(__DIR__ . '/../../config/auth.php', 'auth');
        $this->mergeConfigFrom(__DIR__ . '/../../config/cms.php', 'cms');
        $this->mergeConfigFrom(__DIR__ . '/../../config/cmscountries.php', 'cmscountries');
        $this->mergeConfigFrom(__DIR__ . '/../../config/cmsfile.php', 'cmsfile');
        $this->mergeConfigFrom(__DIR__ . '/../../config/cmslang.php', 'cmslang');
        $this->mergeConfigFrom(__DIR__ . '/../../config/cmsoauth.php', 'cmsoauth');
        $this->mergeConfigFrom(__DIR__ . '/../../config/cmstemplates.php', 'cmstemplates');
        $this->mergeConfigFrom(__DIR__ . '/../../config/cmstypes.php', 'cmstypes');
        $this->mergeConfigWith(__DIR__ . '/../../config/cors.php', 'cors');
        $this->mergeConfigWith(__DIR__ . '/../../config/database.php', 'database');
        $this->mergeConfigWith(__DIR__ . '/../../config/filesystems.php', 'filesystems');
        $this->mergeConfigWith(__DIR__ . '/../../config/image.php', 'image');
        $this->mergeConfigWith(__DIR__ . '/../../config/mail.php', 'mail');
        $this->mergeConfigWith(__DIR__ . '/../../config/services.php', 'services');
        $this->mergeConfigWith(__DIR__ . '/../../config/session.php', 'session');
    }

    /**
     * Register the commands service provider.
     *
     * @return void
     */
    public function registerCommands()
    {
        $this->commands([
            \Tbnt\Cms\Commands\BackupDatabaseCommand::class,
            \Tbnt\Cms\Commands\CreateDefaultPostsCommand::class,
            \Tbnt\Cms\Commands\CreateCountriesPostsCommand::class,
            \Tbnt\Cms\Commands\CreateCountriesTableCommand::class,
            \Tbnt\Cms\Commands\CreateDatabaseCommand::class,
            \Tbnt\Cms\Commands\CreateUserCommand::class,
            \Tbnt\Cms\Commands\DeployCmsCommand::class,
            \Tbnt\Cms\Commands\MigrateCommand::class,
            \Tbnt\Cms\Commands\MigrationsCommand::class,
            \Tbnt\Cms\Commands\MySqlDumpCommand::class,
            \Tbnt\Cms\Commands\SetAppKeyCommand::class,
            \Tbnt\Cms\Commands\SetAppNameCommand::class,
            \Tbnt\Cms\Commands\SetLaravelPassportCommand::class,
            \Tbnt\Cms\Commands\StringDecodeCommand::class,
            \Tbnt\Cms\Commands\StringDecryptCommand::class,
            \Tbnt\Cms\Commands\StringEncodeCommand::class,
            \Tbnt\Cms\Commands\StringEncryptCommand::class,
            \Tbnt\Cms\Commands\StringHashCommand::class,
            \Tbnt\Cms\Commands\StringTableCommand::class,
            \Tbnt\Cms\Commands\TruncatePostsCommand::class,
        ]);
    }

    /**
     * Register env bindings in the container.
     *
     * @return void
     */
    public function publishEnv()
    {
        $this->publishes(
            [
                __DIR__ . '/../../.env.example' => base_path('.env.sample'),
            ],
            'cms.env'
        );
    }

    /**
     * Register htaccess bindings in the container.
     *
     * @return void
     */
    public function publishHtAccess()
    {
        $this->publishes(
            [
                __DIR__ . '/../../.htaccess' => base_path('.htaccess.sample'),
            ],
            'cms.htaccess'
        );
    }

    /**
     * Register config bindings in the container.
     *
     * @return void
     */
    public function publishConfig()
    {
        $this->publishes(
            [
                __DIR__ . '/../../config/cms.php' => config_path('cms.php'),
            ],
            'cms.config-project'
        );

        $this->publishes(
            [
                __DIR__ . '/../../config/cmscountries.php' => config_path('cmscountries.php'),
            ],
            'cms.config-countries'
        );

        $this->publishes(
            [
                __DIR__ . '/../../config/cmsfile.php' => config_path('cmsfile.php'),
            ],
            'cms.config-file'
        );

        $this->publishes(
            [
                __DIR__ . '/../../config/cmslang.php' => config_path('cmslang.php'),
            ],
            'cms.config-lang'
        );

        $this->publishes(
            [
                __DIR__ . '/../../config/cmsoauth.php' => config_path('cmsoauth.php'),
            ],
            'cms.config-oauth'
        );

        $this->publishes(
            [
                __DIR__ . '/../../config/cmstemplates.php' => config_path('cmstemplates.php'),
            ],
            'cms.config-templates'
        );
    }

    /**
     * Register assets bindings in the container.
     *
     * @return void
     */
    public function publishAssets()
    {
        $admin_assets_root = __DIR__ . '/../../public/assets/admin';
        $admin_assets_zip = __DIR__ . '/../../public/assets/admin.zip';

        if (is_file($admin_assets_zip) === true) {
            recursive_rmdir($admin_assets_root);

            $zip = new ZipArchive();

            if ($zip->open($admin_assets_zip) === true) {
                $zip->extractTo($admin_assets_root);
                $zip->close();
            }
        }

        $publishes_cms = [
            __DIR__ . '/../../assets/cms/lib' => base_path('assets/cms/lib'),
            __DIR__ . '/../../assets/cms/web' => base_path('assets/cms/web'),
        ];

        $publishes_update = array_merge($publishes_cms, [
            __DIR__ . '/../../assets/src/sample-react' => base_path('assets/src/sample-react'),
            __DIR__ . '/../../assets/src/sample-tbnt' => base_path('assets/src/sample-tbnt'),
            __DIR__ . '/../../assets/src/sample-vanilla' => base_path('assets/src/sample-vanilla'),
        ]);

        $publishes_install = array_merge($publishes_update, [
            __DIR__ . '/../../.babelrc' => base_path('.babelrc'),
            __DIR__ . '/../../.editorconfig' => base_path('.editorconfig'),
            __DIR__ . '/../../.prettierignore' => base_path('.prettierignore'),
            __DIR__ . '/../../.prettierrc' => base_path('.prettierrc'),
            __DIR__ . '/../../package.json' => base_path('package.json'),
            __DIR__ . '/../../postcss.config.js' => base_path('postcss.config.js'),
            __DIR__ . '/../../webpack.config.js' => base_path('webpack.config.js'),
            __DIR__ . '/../../assets/cms/webpack/logo.png' => public_path('images/logo.png'),
            __DIR__ . '/../../assets/src/web' => base_path('assets/src/web'),
            __DIR__ . '/../../public/images/admin/flags' => public_path('images/admin/flags'),
        ]);

        if (File::exists(public_path('images/logo.png')) === false) {
            $publishes_update[__DIR__ . '/../../assets/cms/webpack/logo.png'] = public_path('images/logo.png');
        }

        $this->publishes(
            array_merge($publishes_install, [
                __DIR__ . '/../../public/assets/admin' => public_path('assets/admin'),
            ]),
            'cms.assets.install'
        );

        $this->publishes(
            array_merge($publishes_update, [
                __DIR__ . '/../../public/assets/admin' => public_path('assets/admin'),
            ]),
            'cms.assets.update'
        );

        $this->publishes(
            array_merge($publishes_install, [
                __DIR__ . '/../../assets/cms/admin' => base_path('assets/cms/admin'),
                __DIR__ . '/../../assets/src/admin' => base_path('assets/src/admin'),
                __DIR__ . '/../../assets/src/sample-admin' => base_path('assets/src/sample-admin'),
            ]),
            'cms.assets.admin.install'
        );

        $this->publishes(
            array_merge($publishes_update, [
                __DIR__ . '/../../assets/cms/admin' => base_path('assets/cms/admin'),
                __DIR__ . '/../../assets/src/sample-admin' => base_path('assets/src/sample-admin'),
            ]),
            'cms.assets.admin.update'
        );

        $this->publishes(
            [
                __DIR__ . '/../../public/assets/admin' => public_path('assets/admin'),
                __DIR__ . '/../../public/images/admin/flags' => public_path('images/admin/flags'),
            ],
            'cms.assets.admin.only'
        );
    }

    /**
     * Register docs bindings in the container.
     *
     * @return void
     */
    public function publishDocs()
    {
        $this->publishes(
            [
                __DIR__ . '/../../docs/api.html' => base_path('docs/api.html'),
            ],
            'cms.docs'
        );
    }

    /**
     * Register migrations bindings in the container.
     *
     * @return void
     */
    public function publishMigrations()
    {
        $this->publishes(
            [
                __DIR__ . '/../../migrations' => database_path('migrations'),
            ],
            'cms.migrations'
        );
    }

    /**
     * Register translations bindings in the container.
     *
     * @return void
     */
    public function publishTranslations()
    {
        $this->publishes(
            [
                __DIR__ . '/../../translations' => resource_path('lang/vendor/cms'),
            ],
            'cms.translations'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/app.php' => resource_path('lang/vendor/cms/en/app.php'),
                __DIR__ . '/../../translations/fr/app.php' => resource_path('lang/vendor/cms/fr/app.php'),
            ],
            'cms.translations.app'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/dates.php' => resource_path('lang/vendor/cms/en/dates.php'),
                __DIR__ . '/../../translations/fr/dates.php' => resource_path('lang/vendor/cms/fr/dates.php'),
            ],
            'cms.translations.dates'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/errors.php' => resource_path('lang/vendor/cms/en/errors.php'),
                __DIR__ . '/../../translations/fr/errors.php' => resource_path('lang/vendor/cms/fr/errors.php'),
            ],
            'cms.translations.errors'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/emails' => resource_path('lang/vendor/cms/en/emails'),
                __DIR__ . '/../../translations/fr/emails' => resource_path('lang/vendor/cms/fr/emails'),
            ],
            'cms.translations.emails'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/emails/defaults.php' => resource_path('lang/vendor/cms/en/emails/defaults.php'),
                __DIR__ . '/../../translations/fr/emails/defaults.php' => resource_path('lang/vendor/cms/fr/emails/defaults.php'),
            ],
            'cms.translations.emails.defaults'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/emails/contact' => resource_path('lang/vendor/cms/en/emails/contact'),
                __DIR__ . '/../../translations/fr/emails/contact' => resource_path('lang/vendor/cms/fr/emails/contact'),
            ],
            'cms.translations.emails.contact'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/emails/contact/contact.php' => resource_path(
                    'lang/vendor/cms/en/emails/contact/contact.php'
                ),
                __DIR__ . '/../../translations/fr/emails/contact/contact.php' => resource_path(
                    'lang/vendor/cms/fr/emails/contact/contact.php'
                ),
            ],
            'cms.translations.emails.contact.contact'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/emails/contact/copy.php' => resource_path(
                    'lang/vendor/cms/en/emails/contact/copy.php'
                ),
                __DIR__ . '/../../translations/fr/emails/contact/copy.php' => resource_path(
                    'lang/vendor/cms/fr/emails/contact/copy.php'
                ),
            ],
            'cms.translations.emails.contact.copy'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/emails/account-activated.php' => resource_path(
                    'lang/vendor/cms/en/emails/account-activated.php'
                ),
                __DIR__ . '/../../translations/fr/emails/account-activated.php' => resource_path(
                    'lang/vendor/cms/fr/emails/account-activated.php'
                ),
            ],
            'cms.translations.emails.account-activated'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/emails/forgot-password.php' => resource_path(
                    'lang/vendor/cms/en/emails/forgot-password.php'
                ),
                __DIR__ . '/../../translations/fr/emails/forgot-password.php' => resource_path(
                    'lang/vendor/cms/fr/emails/forgot-password.php'
                ),
            ],
            'cms.translations.emails.forgot-password'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/emails/new-password.php' => resource_path(
                    'lang/vendor/cms/en/emails/new-password.php'
                ),
                __DIR__ . '/../../translations/fr/emails/new-password.php' => resource_path(
                    'lang/vendor/cms/fr/emails/new-password.php'
                ),
            ],
            'cms.translations.emails.new-password'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/modules' => resource_path('lang/vendor/cms/en/modules'),
                __DIR__ . '/../../translations/fr/modules' => resource_path('lang/vendor/cms/fr/modules'),
            ],
            'cms.translations.modules'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/modules/dates.php' => resource_path('lang/vendor/cms/en/modules/dates.php'),
                __DIR__ . '/../../translations/fr/modules/dates.php' => resource_path('lang/vendor/cms/fr/modules/dates.php'),
            ],
            'cms.translations.modules.dates'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/modules/errors.php' => resource_path('lang/vendor/cms/en/modules/errors.php'),
                __DIR__ . '/../../translations/fr/modules/errors.php' => resource_path('lang/vendor/cms/fr/modules/errors.php'),
            ],
            'cms.translations.modules.errors'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/modules/inputs.php' => resource_path('lang/vendor/cms/en/modules/inputs.php'),
                __DIR__ . '/../../translations/fr/modules/inputs.php' => resource_path('lang/vendor/cms/fr/modules/inputs.php'),
            ],
            'cms.translations.modules.inputs'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/modules/pagination.php' => resource_path(
                    'lang/vendor/cms/en/modules/pagination.php'
                ),
                __DIR__ . '/../../translations/fr/modules/pagination.php' => resource_path(
                    'lang/vendor/cms/fr/modules/pagination.php'
                ),
            ],
            'cms.translations.modules.pagination'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/modules/price.php' => resource_path('lang/vendor/cms/en/modules/price.php'),
                __DIR__ . '/../../translations/fr/modules/price.php' => resource_path('lang/vendor/cms/fr/modules/price.php'),
            ],
            'cms.translations.modules.price'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/modules/splash.php' => resource_path('lang/vendor/cms/en/modules/splash.php'),
                __DIR__ . '/../../translations/fr/modules/splash.php' => resource_path('lang/vendor/cms/fr/modules/splash.php'),
            ],
            'cms.translations.modules.splash'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/modules/words.php' => resource_path('lang/vendor/cms/en/modules/words.php'),
                __DIR__ . '/../../translations/fr/modules/words.php' => resource_path('lang/vendor/cms/fr/modules/words.php'),
            ],
            'cms.translations.modules.words'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/pages' => resource_path('lang/vendor/cms/en/pages'),
                __DIR__ . '/../../translations/fr/pages' => resource_path('lang/vendor/cms/fr/pages'),
            ],
            'cms.translations.pages'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/pages/example.php' => resource_path('lang/vendor/cms/en/pages/example.php'),
                __DIR__ . '/../../translations/fr/pages/example.php' => resource_path('lang/vendor/cms/fr/pages/example.php'),
            ],
            'cms.translations.pages.example'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/trans' => resource_path('lang/vendor/cms/en/trans'),
                __DIR__ . '/../../translations/fr/trans' => resource_path('lang/vendor/cms/fr/trans'),
            ],
            'cms.translations.trans'
        );

        $this->publishes(
            [
                __DIR__ . '/../../translations/en/trans/example.php' => resource_path('lang/vendor/cms/en/trans/example.php'),
                __DIR__ . '/../../translations/fr/trans/example.php' => resource_path('lang/vendor/cms/fr/trans/example.php'),
            ],
            'cms.translations.trans.example'
        );
    }

    /**
     * Register views bindings in the container.
     *
     * @return void
     */
    public function publishViews()
    {
        $this->publishes(
            [
                __DIR__ . '/../../views' => resource_path('views/vendor/cms'),
            ],
            'cms.views'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/admin' => resource_path('views/vendor/cms/admin'),
            ],
            'cms.views.admin'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/admin/includes' => resource_path('views/vendor/cms/admin/includes'),
            ],
            'cms.views.admin.includes'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/admin/includes/splash.blade.php' => resource_path(
                    'views/vendor/cms/admin/includes/splash.blade.php'
                ),
            ],
            'cms.views.admin.includes.splash'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/web' => resource_path('views/vendor/cms/web'),
            ],
            'cms.views.web'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/web/services.blade.php' => resource_path('views/vendor/cms/web/services.blade.php'),
            ],
            'cms.views.web.services'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/web/includes' => resource_path('views/vendor/cms/web/includes'),
            ],
            'cms.views.web.includes'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/web/includes/head.blade.php' => resource_path(
                    'views/vendor/cms/web/includes/head.blade.php'
                ),
            ],
            'cms.views.web.includes.head'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/web/includes/splash.blade.php' => resource_path(
                    'views/vendor/cms/web/includes/splash.blade.php'
                ),
            ],
            'cms.views.web.includes.splash'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/compatibility' => resource_path('views/vendor/cms/compatibility'),
            ],
            'cms.views.compatibility'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/compatibility/browsehappy.blade.php' => resource_path(
                    'views/vendor/cms/compatibility/browsehappy.blade.php'
                ),
            ],
            'cms.views.compatibility.browsehappy'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/compatibility/nojs.blade.php' => resource_path(
                    'views/vendor/cms/compatibility/nojs.blade.php'
                ),
            ],
            'cms.views.compatibility.nojs'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails' => resource_path('views/vendor/cms/emails'),
            ],
            'cms.views.emails'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/app' => resource_path('views/vendor/cms/emails/app'),
            ],
            'cms.views.emails.app'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/app/html' => resource_path('views/vendor/cms/emails/app/html'),
                __DIR__ . '/../../views/emails/app/html.blade.php' => resource_path('views/vendor/cms/emails/app/html.blade.php'),
            ],
            'cms.views.emails.app.html'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/app/plain.blade.php' => resource_path(
                    'views/vendor/cms/emails/app/plain.blade.php'
                ),
            ],
            'cms.views.emails.app.plain'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/contact' => resource_path('views/vendor/cms/emails/contact'),
            ],
            'cms.views.emails.contact'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/contact/contact' => resource_path('views/vendor/cms/emails/contact/contact'),
            ],
            'cms.views.emails.contact.contact'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/contact/contact/html.blade.php' => resource_path(
                    'views/vendor/cms/emails/contact/contact/html.blade.php'
                ),
            ],
            'cms.views.emails.contact.contact.html'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/contact/contact/plain.blade.php' => resource_path(
                    'views/vendor/cms/emails/contact/contact/plain.blade.php'
                ),
            ],
            'cms.views.emails.contact.contact.plain'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/contact/copy' => resource_path('views/vendor/cms/emails/contact/copy'),
            ],
            'cms.views.emails.contact.copy'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/contact/copy/html.blade.php' => resource_path(
                    'views/vendor/cms/emails/contact/copy/html.blade.php'
                ),
            ],
            'cms.views.emails.contact.copy.html'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/contact/copy/plain.blade.php' => resource_path(
                    'views/vendor/cms/emails/contact/copy/plain.blade.php'
                ),
            ],
            'cms.views.emails.contact.copy.plain'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/account-activated' => resource_path('views/vendor/cms/emails/account-activated'),
            ],
            'cms.views.emails.account-activated'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/account-activated/html.blade.php' => resource_path(
                    'views/vendor/cms/emails/account-activated/html.blade.php'
                ),
            ],
            'cms.views.emails.account-activated.html'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/account-activated/plain.blade.php' => resource_path(
                    'views/vendor/cms/emails/account-activated/plain.blade.php'
                ),
            ],
            'cms.views.emails.account-activated.plain'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/forgot-password' => resource_path('views/vendor/cms/emails/forgot-password'),
            ],
            'cms.views.emails.forgot-password'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/forgot-password/html.blade.php' => resource_path(
                    'views/vendor/cms/emails/forgot-password/html.blade.php'
                ),
            ],
            'cms.views.emails.forgot-password.html'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/forgot-password/plain.blade.php' => resource_path(
                    'views/vendor/cms/emails/forgot-password/plain.blade.php'
                ),
            ],
            'cms.views.emails.forgot-password.plain'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/new-password' => resource_path('views/vendor/cms/emails/new-password'),
            ],
            'cms.views.emails.new-password'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/new-password/html.blade.php' => resource_path(
                    'views/vendor/cms/emails/new-password/html.blade.php'
                ),
            ],
            'cms.views.emails.new-password.html'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/emails/new-password/plain.blade.php' => resource_path(
                    'views/vendor/cms/emails/new-password/plain.blade.php'
                ),
            ],
            'cms.views.emails.new-password.plain'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/errors' => resource_path('views/vendor/cms/errors'),
            ],
            'cms.views.errors'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/errors/exception.blade.php' => resource_path(
                    'views/vendor/cms/errors/exception.blade.php'
                ),
            ],
            'cms.views.errors.exception'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/xmls' => resource_path('views/vendor/cms/xmls'),
            ],
            'cms.views.xml'
        );

        $this->publishes(
            [
                __DIR__ . '/../../views/xml/sitemap.blade.php' => resource_path('views/vendor/cms/xml/sitemap.blade.php'),
            ],
            'cms.views.xml.sitemap'
        );
    }

    /**
     * Merge the given configuration with the existing configuration.
     *
     * @param string $path
     * @param string $key
     * @return void
     */
    protected function mergeConfigFrom($path, $key)
    {
        $config = $this->app['config']->get($key, []);

        $this->app['config']->set($key, $this->mergeConfig(require $path, $config));
    }

    /**
     * Merge the given configuration with the existing configuration.
     *
     * @param string $path
     * @param string $key
     * @return void
     */
    protected function mergeConfigWith(string $path, string $key)
    {
        $config = $this->app['config']->get($key, []);

        $this->app['config']->set($key, $this->mergeConfig($config, require $path));
    }

    /**
     * Merges the configs together and takes multi-dimensional arrays into account.
     *
     * @param array $original
     * @param array $merging
     * @return array
     */
    protected function mergeConfig(array $original, array $merging)
    {
        $array = array_merge($original, $merging);

        foreach ($original as $key => $value) {
            if (!is_array($value)) {
                continue;
            }

            if (!arr()->exists($merging, $key)) {
                continue;
            }

            if (is_numeric($key)) {
                continue;
            }

            $array[$key] = $this->mergeConfig($value, $merging[$key]);
        }

        return $array;
    }
}
