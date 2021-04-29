<?php

namespace Tbnt\Cms\Providers;

use Illuminate\Support\ServiceProvider;

class ObserverServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        \Tbnt\Cms\Model\File::observe(\Tbnt\Cms\Observers\FileObserver::class);
        \Tbnt\Cms\Model\Post::observe(\Tbnt\Cms\Observers\PostObserver::class);
        \Tbnt\Cms\Model\PostItem::observe(\Tbnt\Cms\Observers\PostItemObserver::class);
        \Tbnt\Cms\Model\PostItemLang::observe(\Tbnt\Cms\Observers\PostItemLangObserver::class);
        \Tbnt\Cms\Model\PostLang::observe(\Tbnt\Cms\Observers\PostLangObserver::class);
        \Tbnt\Cms\Model\PostType::observe(\Tbnt\Cms\Observers\PostTypeObserver::class);
        \Tbnt\Cms\Model\PostTypeItem::observe(\Tbnt\Cms\Observers\PostTypeItemObserver::class);
        \Tbnt\Cms\Model\PostTypeItemCondition::observe(\Tbnt\Cms\Observers\PostTypeItemConditionObserver::class);
        \Tbnt\Cms\Model\PostTypeItemLang::observe(\Tbnt\Cms\Observers\PostTypeItemLangObserver::class);
        \Tbnt\Cms\Model\PostTypeItemRestriction::observe(\Tbnt\Cms\Observers\PostTypeItemRestrictionObserver::class);
        \Tbnt\Cms\Model\PostTypeLang::observe(\Tbnt\Cms\Observers\PostTypeLangObserver::class);
        \Tbnt\Cms\Model\User::observe(\Tbnt\Cms\Observers\UserObserver::class);
    }
}
