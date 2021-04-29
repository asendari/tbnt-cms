<?php

namespace Tbnt\Cms\Commands;

use Tbnt\Cms\Model\Post;
use Tbnt\Cms\Model\PostLang;
use Tbnt\Cms\Model\PostType;

class CreateDefaultPostsCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:create-default-posts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create default posts.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        $this->info('Checking default posts...');

        $check = $this->hasPostType();

        if ($check === true) {
            if ($this->confirm('The default posts already exist. Do you want to rebuild them?') === false) {
                return;
            }

            $this->dropPostType();
        }

        $this->info('Importing default post...');

        $this->createPostType();

        $this->info('The default posts has been successfully created.');
    }

    /**
     * Check post type.
     *
     * @return bool
     */
    public function hasPostType()
    {
        return PostType::isType([config('cmstypes.page'), config('cmstypes.translation')])->exists();
    }

    /**
     * Drop post type.
     *
     * @return void
     */
    public function dropPostType()
    {
        PostType::isType([config('cmstypes.page'), config('cmstypes.translation')])
            ->get()
            ->each(function ($p) {
                $p->delete();
            });
    }

    /**
     * Create post type.
     *
     * @return void
     */
    public function createPostType()
    {
        $lang_id = lang()->getDefaultId();

        /**
         * Add post type - page
         */

        $post_type__page = PostType::create([
            'type' => config('cmstypes.page'),
            'label' => 'Page',
            'data' => [
                'modes' => [
                    'hidden_at' => 0,
                    'position' => 0,
                    'post_id' => 0,
                    'visible_at' => 0,
                ],
                'order' => 'reference-0',
            ],
            'mode' => 2,
            'has_key' => 1,
            'is_page' => 1,
            'is_loaded' => 1,
            'is_lazy' => 1,
            'is_active' => 1,
        ]);

        /**
         * Add post type items - page
         */

        $post_type_item__page__home = $post_type__page->post_type_items()->create([
            'post_type_id' => $post_type__page->id,
            'post_type_item_id' => null,
            'key' => 'details',
            'label' => 'Détails',
            'type' => 'group',
            'data' => null,
            'position' => 1,
            'mode' => 2,
            'is_required' => 0,
            'is_translatable' => 0,
        ]);

        $post_type_item__page__home_title = $post_type__page->post_type_items()->create([
            'post_type_id' => $post_type__page->id,
            'post_type_item_id' => $post_type_item__page__home->id,
            'key' => 'title',
            'label' => 'Titre',
            'type' => 'text',
            'data' => null,
            'position' => 0,
            'mode' => 2,
            'is_required' => 1,
            'is_translatable' => 1,
        ]);

        /**
         * Add post - page
         */

        $post__page = Post::create([
            'post_id' => null,
            'post_type_id' => $post_type__page->id,
            'key' => 'home',
            'reference' => 'Accueil',
            'data' => [
                'modes' => [
                    'url' => 0,
                ],
            ],
            'position' => 0,
            'is_indexable' => 1,
            'is_visible' => 1,
            'is_active' => 1,
        ]);

        /**
         * Add post lang - page
         */

        PostLang::create([
            'post_id' => $post__page->id,
            'lang_id' => $lang_id,
            'url' => '/',
            'title' => 'Accueil',
            'description' => 'Accueil',
        ]);

        /**
         * Add post items - page
         */

        $post_item__page__home = $post__page->post_items()->create([
            'post_id' => $post__page->id,
            'post_item_id' => null,
            'post_type_item_id' => $post_type_item__page__home->id,
            'value' => null,
            'position' => 0,
        ]);

        $post_item__page__home_title = $post__page->post_items()->create([
            'post_id' => $post__page->id,
            'post_item_id' => $post_item__page__home->id,
            'post_type_item_id' => $post_type_item__page__home_title->id,
            'value' => null,
            'position' => 0,
        ]);

        $post_item__page__home_title->trans()->create([
            'post_item_id' => $post_item__page__home_title->id,
            'lang_id' => $lang_id,
            'value' => 'Accueil',
        ]);

        /**
         * Add post restrictions - page
         */

        $post__page->post_type_item_restrictions()->create([
            'post_type_item_id' => $post_type_item__page__home->id,
        ]);

        /**
         * Add post type - translation
         */

        $post_type__translation = PostType::create([
            'type' => config('cmstypes.translation'),
            'label' => 'Traduction',
            'data' => [
                'modes' => [
                    'hidden_at' => 0,
                    'position' => 0,
                    'visible_at' => 0,
                ],
                'order' => 'reference-0',
            ],
            'mode' => 2,
            'has_key' => 1,
            'is_page' => 0,
            'is_loaded' => 1,
            'is_active' => 1,
        ]);

        /**
         * Add post type items - translation
         */

        $post_type_item__translation__words = $post_type__translation->post_type_items()->create([
            'post_type_id' => $post_type__translation->id,
            'post_type_item_id' => null,
            'key' => 'words',
            'label' => 'Words',
            'type' => 'group',
            'data' => null,
            'position' => 1,
            'mode' => 2,
            'is_required' => 0,
            'is_translatable' => 0,
        ]);

        $post_type_item__translation__words_modal = $post_type__translation->post_type_items()->create([
            'post_type_id' => $post_type__translation->id,
            'post_type_item_id' => $post_type_item__translation__words->id,
            'key' => 'modal',
            'label' => 'Modal',
            'type' => 'text',
            'data' => null,
            'position' => 0,
            'mode' => 2,
            'is_required' => 1,
            'is_translatable' => 1,
        ]);

        /**
         * Add post - words
         */

        $post__words = Post::create([
            'post_id' => null,
            'post_type_id' => $post_type__translation->id,
            'key' => 'words',
            'reference' => 'Mots',
            'data' => null,
            'position' => 0,
            'is_indexable' => 0,
            'is_visible' => 0,
            'is_active' => 1,
        ]);

        /**
         * Add post items - words
         */

        $post_item__words__words = $post__words->post_items()->create([
            'post_id' => $post__words->id,
            'post_item_id' => null,
            'post_type_item_id' => $post_type_item__translation__words->id,
            'value' => null,
            'position' => 0,
        ]);

        $post_item__words__words_modal = $post__words->post_items()->create([
            'post_id' => $post__words->id,
            'post_item_id' => $post_item__words__words->id,
            'post_type_item_id' => $post_type_item__translation__words_modal->id,
            'value' => null,
            'position' => 0,
        ]);

        $post_item__words__words_modal->trans()->create([
            'post_item_id' => $post_item__words__words_modal->id,
            'lang_id' => $lang_id,
            'value' => 'Modal',
        ]);

        /**
         * Add post restrictions - words
         */

        $post__words->post_type_item_restrictions()->create([
            'post_type_item_id' => $post_type_item__translation__words->id,
        ]);
    }
}
