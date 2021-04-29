<?php

namespace Tbnt\Cms\Http\Controllers\Api\Web;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Http\Resources\Web\PostItemsRecursiveResource;
use Tbnt\Cms\Http\Resources\Web\PostResource;
use Tbnt\Cms\Model\Post;

class ConfigController extends BaseController
{
    /**
     * Translations path
     *
     * @var string
     */
    protected $trans_path = __DIR__ . '/../../../../../translations';

    /**
     * Get pages
     *
     * @param Request $request
     * @return array
     */
    public function get(Request $request)
    {
        set_time_limit_safe(60 * 5);

        $langs = ['cms' => []];

        foreach (['modules', 'pages', 'trans'] as $folder) {
            $langs[$folder] = [];

            $folder_dir = dir_separator([$this->trans_path, lang()->getCurrentCode(), $folder]);

            if (File::exists($folder_dir) === false) {
                continue;
            }

            foreach (File::files($folder_dir) as $file) {
                $basename = $file->getBasename('.php');

                $langs[$folder][str()->snake(str()->camel($basename))] =
                    lang()->getCurrentCode() === lang()->getDefaultCode()
                        ? __('cms::' . $folder . '/' . $basename, [], lang()->getCurrentCode())
                        : array_replace_recursive(
                            __('cms::' . $folder . '/' . $basename, [], lang()->getDefaultCode()),
                            __('cms::' . $folder . '/' . $basename, [], lang()->getCurrentCode())
                        );
            }
        }

        $with_lazy = ['trans', 'post_type', 'post_recursive'];
        $with = array_merge(['post_items_recursive'], $with_lazy);

        $landing_post = $request->input('path')
            ? Post::isValid()
                ->findByPath(clean_url_lang($request->input('path'), lang()->getCurrentCode()))
                ->with($with)
                ->first()
            : null;

        $landing_post =
            $landing_post !== null &&
            ($landing_post->post_type->is_loaded === false || $landing_post->post_type->is_lazy === true)
                ? new PostResource($landing_post)
                : null;

        $posts = [];
        $lazy_posts = [];

        // Post::setUnsafe();

        // Post::isValid()
        //     ->isLoaded()
        //     ->isLazy(true)
        //     ->with($with_lazy)
        //     ->orderBy('position')
        //     ->chunk(1000, function ($results) use (&$posts, &$lazy_posts, &$langs) {
        //         foreach ($results as $result) {
        //             $lazy_posts[] = new PostLazyResource($result);
        //         }
        //     });

        Post::isValid()
            ->isLoaded()
            // ->isLazy(false)
            ->with($with)
            ->orderBy('position')
            ->chunk(50, function ($results) use (&$posts, &$lazy_posts, &$langs) {
                foreach ($results as $result) {
                    if ($result->post_type->type === config('cmstypes.translation')) {
                        if ($result->post_type->has_key) {
                            $langs['cms'][$result->key] = new PostItemsRecursiveResource($result->post_items_recursive);
                        } else {
                            $langs['cms'][] = new PostItemsRecursiveResource($result->post_items_recursive);
                        }
                    } else {
                        if (!isset($posts[$result->post_type->type])) {
                            $posts[$result->post_type->type] = [];
                        }

                        if ($result->post_type->has_key) {
                            $posts[$result->post_type->type][$result->key] = new PostResource($result);
                        } else {
                            $posts[$result->post_type->type][] = new PostResource($result);
                        }
                    }
                }
            });

        return [
            'posts' => $posts,
            'lazy_posts' => $lazy_posts,
            'landing_post' => $landing_post,
            'langs' => $langs,
        ];
    }
}
