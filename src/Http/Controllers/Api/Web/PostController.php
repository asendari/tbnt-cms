<?php

namespace Tbnt\Cms\Http\Controllers\Api\Web;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Http\Resources\Web\PostResource;
use Tbnt\Cms\Model\Post;

class PostController extends BaseController
{
    /**
     * Lazy/eager loading values
     *
     * @var array
     */
    public $with = ['trans', 'post_type', 'post_recursive'];

    /**
     * Lazy/eager loading values
     *
     * @var array
     */
    public $with_items = ['trans', 'post_type', 'post_recursive', 'post_items_recursive'];

    /**
     * Get posts
     *
     * @param Request $request
     * @param array $options
     * @return Builder
     */
    public function get(Request $request, $options = [])
    {
        $query_options = array_merge(
            [
                'date' => date('Y-m-d H:i:s'),
                'order' => 'visible_at-1',
                'with' => [],
                'type' => null,
                'ids' => null,
                'exclude_ids' => null,
                'search' => null,
                'search_by' => null,
                'search_multiple' => true,
                'shuffle' => null,
            ],
            $request->input(),
            $options
        );

        $query = Post::with($query_options['with'])
            ->isValid()
            ->isBefore($query_options['date']);

        if ($query_options['shuffle'] === true) {
            $query->inRandomOrder();
        } elseif ($query_options['order'] !== null) {
            $query->isOrdered($query_options['order']);
        }

        if ($query_options['type'] !== null) {
            $query->isType($query_options['type']);
        }

        if ($query_options['ids'] !== null) {
            $query->within($query_options['ids']);
        }

        if ($query_options['exclude_ids'] !== null) {
            $query->withinNot($query_options['exclude_ids']);
        }

        if ($query_options['search_by'] !== null && is_array($query_options['search_by']) === true) {
            $query->search(
                key($query_options['search_by']),
                current($query_options['search_by']),
                $query_options['search_multiple']
            );
        }

        if ($query_options['search'] !== null && is_array($query_options['search']) === true) {
            foreach ($query_options['search'] as $key => $value) {
                $query->searchKeyValues($key, $value, $query_options['search_multiple']);
            }
        }

        return $query;
    }

    /**
     * List posts
     *
     * @param Request $request
     * @param array $options
     * @return AnonymousResourceCollection
     */
    public function list(Request $request, $options = [])
    {
        return PostResource::collection(
            $this->get(
                $request,
                array_merge(['with' => $request->input('without_items') === true ? $this->with : $this->with_items], $options)
            )->paginate()
        );
    }

    /**
     * Find posts
     *
     * @param Request $request
     * @return PostResource
     */
    public function find(Request $request)
    {
        $query_options = array_merge(
            [
                'prev' => -1,
                'next' => -1,
            ],
            $request->only(['prev', 'next'])
        );

        $path_post = Post::isValid()
            ->findByPath(clean_url_lang($request->input('path'), lang()->getCurrentCode()))
            ->first();

        if ($path_post === null) {
            abort(404);
        } elseif ($query_options['prev'] !== -1 || $query_options['next'] !== -1) {
            $posts = $this->list($request, ['start' => 0, 'count' => -1]);

            foreach ($posts as $i => &$post) {
                if ($post->id !== $path_post->id) {
                    continue;
                }

                $additional = [];

                if ($query_options['prev'] !== -1) {
                    $additional['prev'] = PostResource::collection(
                        $posts->intersectByKeys(array_fill($i - $query_options['prev'], $query_options['prev'], null))->values()
                    );
                }
                if ($query_options['next'] !== -1) {
                    $additional['next'] = PostResource::collection(
                        $posts->intersectByKeys(array_fill($i + 1, $query_options['next'], null))->values()
                    );
                }

                return (new PostResource($post))->additional(['additional' => $additional]);
            }
        }

        return new PostResource($path_post->load($this->with_items));
    }

    /**
     * Get post
     *
     * @param Request $request
     * @param Post $post
     * @return PostResource
     */
    public function one(Request $request, Post $post)
    {
        return new PostResource(
            Post::isValid()
                ->findOrFail($post->id)
                ->load($this->with_items)
        );
    }
}
