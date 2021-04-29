<?php

namespace Tbnt\Cms\Commands;

use Tbnt\Cms\Model\Post;
use Tbnt\Cms\Model\PostType;

class CreateCountriesPostsCommand extends BaseCommand
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:create-countries-posts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create "country" posts.';

    /**
     * The post type key.
     *
     * @var string
     */
    protected $post_type = 'country';

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
        $this->info('Checking "' . $this->post_type . '" posts...');

        $check = $this->hasPostType();

        if ($check === true) {
            if ($this->confirm('The "' . $this->post_type . '" posts already exists. Do you want to rebuild it?') === false) {
                return;
            }

            $this->dropPostType();
        }

        $this->info('Importing "' . $this->post_type . '" posts...');

        $this->createPostType();

        $this->info('The "' . $this->post_type . '" posts has been successfully created.');
    }

    /**
     * Check post type.
     *
     * @return bool
     */
    public function hasPostType()
    {
        return PostType::isType($this->post_type)->exists();
    }

    /**
     * Drop post type.
     *
     * @return void
     */
    public function dropPostType()
    {
        PostType::isType($this->post_type)
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
        /**
         * Add post type - country
         */

        $post_type__country = PostType::create([
            'type' => $this->post_type,
            'label' => 'Pays',
            'data' => [
                'modes' => [
                    'hidden_at' => 0,
                    'post_id' => 0,
                    'visible_at' => 0,
                ],
                'order' => 'reference-0',
            ],
            'mode' => 3,
            'has_key' => 1,
            'is_page' => 0,
            'is_loaded' => 0,
            'is_active' => 1,
        ]);

        /**
         * Add post type items - country
         */

        $post_type_item__country__details = $post_type__country->post_type_items()->create([
            'post_type_id' => $post_type__country->id,
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

        $post_type_item__country__details_name = $post_type__country->post_type_items()->create([
            'post_type_id' => $post_type__country->id,
            'post_type_item_id' => $post_type_item__country__details->id,
            'key' => 'name',
            'label' => 'Nom',
            'type' => 'text',
            'data' => null,
            'position' => 0,
            'mode' => 2,
            'is_required' => 1,
            'is_translatable' => 1,
        ]);

        $post_type_item__country__details_code = $post_type__country->post_type_items()->create([
            'post_type_id' => $post_type__country->id,
            'post_type_item_id' => $post_type_item__country__details->id,
            'key' => 'code',
            'label' => 'Code',
            'type' => 'text',
            'data' => null,
            'position' => 1,
            'mode' => 2,
            'is_required' => 1,
            'is_translatable' => 0,
        ]);

        /**
         * Add posts - country
         */

        $lang_id = lang()->getDefaultId();

        foreach (config('cmscountries.list') as $i => $country) {
            /**
             * Add post - country
             */

            $post__country = Post::create([
                'post_id' => null,
                'post_type_id' => $post_type__country->id,
                'key' => $country['code'],
                'reference' => $country['name'],
                'data' => null,
                'position' => $i,
                'is_indexable' => 1,
                'is_visible' => 1,
                'is_active' => 1,
            ]);

            /**
             * Add post items - country
             */

            $post_item__country__details = $post__country->post_items()->create([
                'post_id' => $post__country->id,
                'post_item_id' => null,
                'post_type_item_id' => $post_type_item__country__details->id,
                'value' => null,
                'position' => 0,
            ]);

            $post_item__country__details_name = $post__country->post_items()->create([
                'post_id' => $post__country->id,
                'post_item_id' => $post_item__country__details->id,
                'post_type_item_id' => $post_type_item__country__details_name->id,
                'value' => null,
                'position' => 0,
            ]);

            $post_item__country__details_name->trans()->create([
                'post_item_id' => $post_item__country__details_name->id,
                'lang_id' => $lang_id,
                'value' => $country['name'],
            ]);

            $post__country->post_items()->create([
                'post_id' => $post__country->id,
                'post_item_id' => $post_item__country__details->id,
                'post_type_item_id' => $post_type_item__country__details_code->id,
                'value' => $country['code'],
                'position' => 0,
            ]);
        }
    }
}
