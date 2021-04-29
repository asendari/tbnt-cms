<?php

namespace Tbnt\Cms\Http\Controllers\Web;

use Illuminate\Http\Response;
use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Model\Post;

class SitemapController extends BaseController
{
    /**
     * Generate sitemap
     *
     * @return Response
     */
    public function view()
    {
        $posts = Post::isValidPageIndexable()
            ->with(['trans', 'post.trans'])
            ->get();

        $sitemap = [];
        $hidden_lang_codes = lang()->getHiddenCodes();

        foreach ($posts as $post) {
            $canonical = $post->canonical;
            $canonical_urls = [];

            foreach ($canonical as $lang_code => $canonical_url) {
                if (in_array($lang_code, $hidden_lang_codes) === false) {
                    $canonical_urls[$lang_code] = app_url($canonical_url);
                }
            }

            foreach ($canonical_urls as $canonical_url) {
                $sitemap[] = [
                    'loc' => $canonical_url,
                    'lastmod' => to_iso8601_string($post->updated_at),
                    'xhtml:link' => $canonical_urls,
                ];
            }
        }

        $extra = config('cms.extra_canonicals');

        if (is_callable($extra)) {
            foreach ($extra($hidden_lang_codes) as $extra_item) {
                $sitemap[] = $extra_item;
            }
        }

        $view = view('cms::xml.sitemap', ['data' => $sitemap]);

        return response($view, '200')->header('Content-Type', 'text/xml');
    }
}
