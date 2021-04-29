<?php

namespace Tbnt\Cms\Http\Controllers\Web;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Http\Resources\Web\PostResource;
use Tbnt\Cms\Model\Post;

class HomeController extends BaseController
{
    /**
     * Get home page
     *
     * @param Request $request
     * @param string $path
     * @return Application|Factory|View|PostResource
     */
    public function getPage(Request $request, $path = '')
    {
        $current_code = lang()->getCurrentCode();
        $current_path = clean_url_lang($path, $current_code);

        $post = Post::isValid()
            ->findByPath($current_path)
            ->with(['trans', 'post_type', 'post_recursive', 'post_items_recursive'])
            ->first();

        if ($post === null) {
            $config = config('cms.extra_slugs');

            $post = Post::isValid()
                ->isPage()
                ->isKey(array_keys($config))
                ->with(['trans', 'post_type', 'post_recursive'])
                ->get()
                ->first(function ($post) use ($current_code, $current_path) {
                    return strpos($current_path, $post->canonical[$current_code] ?? null) === 0;
                });

            if ($post === null) {
                abort(404);
            }

            $item_config = $config[$post->key] ?? null;
            $item = is_callable($item_config) ? $item_config($request, $current_code, $current_path, $path) : null;

            if ($item === null) {
                abort(404);
            }

            if ($request->expectsJson() === true) {
                return (new PostResource($post))->additional(['item' => $item]);
            } else {
                return view('cms::web.app', $item['meta'] ?? []);
            }
        }

        if ($request->expectsJson() === true) {
            return new PostResource($post);
        }

        return view('cms::web.app', [
            'title' => $post->display_lang->title,
            'description' => $post->display_lang->description,
            'canonical' => $post->canonical,
            'is_indexable' => $post->is_indexable,
        ]);
    }
}
