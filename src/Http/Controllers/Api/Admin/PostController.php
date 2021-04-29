<?php

namespace Tbnt\Cms\Http\Controllers\Api\Admin;

use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Http\Requests\Admin\PostMediaRequest;
use Tbnt\Cms\Http\Requests\Admin\PostRequest;
use Tbnt\Cms\Http\Resources\Admin\PostListResource;
use Tbnt\Cms\Http\Resources\Admin\PostResource;
use Tbnt\Cms\Model\Post;
use Tbnt\Cms\Model\PostType;

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
     * @return Builder|Post
     */
    public function get(Request $request, $options = [])
    {
        $query_options = array_merge(
            [
                'date' => date('Y-m-d H:i:s'),
                'order' => 'created_at-1',
                'with' => [],
                'type' => null,
                'ids' => null,
                'exclude_ids' => null,
                'post_id' => null,
                'is_indexable' => null,
                'is_page' => null,
                'is_loaded' => null,
                'search' => null,
            ],
            $request->input(),
            $options
        );

        $query = Post::with($query_options['with'])
            ->isBefore($query_options['date'])
            ->isOrdered($query_options['order']);

        if ($query_options['type'] !== null) {
            $query->isType($query_options['type']);
        }

        if ($query_options['ids'] !== null) {
            $query->within($query_options['ids']);
        }

        if ($query_options['exclude_ids'] !== null) {
            $query->withinNot($query_options['exclude_ids']);
        }

        if ($query_options['post_id'] !== null) {
            $query->isPostId($query_options['post_id']);
        }

        if ($query_options['is_indexable'] !== null) {
            $query->isIndexable($query_options['is_indexable']);
        }

        if ($query_options['is_page'] !== null) {
            $query->isPage($query_options['is_page']);
        }

        if ($query_options['is_loaded'] !== null) {
            $query->isLoaded($query_options['is_loaded']);
        }

        if ($query_options['search'] !== null && is_array($query_options['search']) === true) {
            $query->search(key($query_options['search']), current($query_options['search']));
        }

        return $query;
    }

    /**
     * List posts
     *
     * @param Request $request
     * @param PostType|null $post_type
     * @return AnonymousResourceCollection
     */
    public function list(Request $request, PostType $post_type = null)
    {
        return PostListResource::collection(
            $this->get($request, ['type' => optional($post_type)->type, 'with' => $this->with])->paginate()
        );
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
        return new PostResource($post->load($this->with_items));
    }

    /**
     * Create post
     *
     * @param PostRequest $request
     * @param PostType|null $post_type
     * @return PostResource
     */
    public function create(PostRequest $request, PostType $post_type = null)
    {
        $post = new Post();
        $post->setPostTypeId($post_type->id);
        $post->updateData($request->all());

        return $this->one($request, $post->fresh());
    }

    /**
     * Update post
     *
     * @param PostRequest $request
     * @param Post $post
     * @return PostResource
     */
    public function oneUpdate(PostRequest $request, Post $post)
    {
        $post->updateData($request->all());

        return $this->one($request, $post);
    }

    /**
     * Update post media
     *
     * @param PostMediaRequest $request
     * @param Post $post
     * @return PostResource
     */
    public function oneMediaUpdate(PostMediaRequest $request, Post $post)
    {
        $post->updateMedia($request->all());

        return $this->one($request, $post);
    }

    /**
     * Active post
     *
     * @param Request $request
     * @param Post $post
     * @return PostResource
     */
    public function oneActive(Request $request, Post $post)
    {
        $post->setActive(true);

        return $this->one($request, $post);
    }

    /**
     * Inactive post
     *
     * @param Request $request
     * @param Post $post
     * @return PostResource
     */
    public function oneInactive(Request $request, Post $post)
    {
        $post->setActive(false);

        return $this->one($request, $post);
    }

    /**
     * Delete post
     *
     * @param Request $request
     * @param Post $post
     * @return PostResource
     * @throws Exception
     */
    public function oneDelete(Request $request, Post $post)
    {
        $post->delete();

        return $this->one($request, $post);
    }
}
