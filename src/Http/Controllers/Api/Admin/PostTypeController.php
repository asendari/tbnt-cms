<?php

namespace Tbnt\Cms\Http\Controllers\Api\Admin;

use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Http\Requests\Admin\PostTypeRequest;
use Tbnt\Cms\Http\Resources\Admin\PostTypeResource;
use Tbnt\Cms\Model\PostType;

class PostTypeController extends BaseController
{
    /**
     * Lazy/eager loading values
     *
     * @var array
     */
    public $with = ['post_type_items_recursive'];

    /**
     * Get posts types
     *
     * @param Request $request
     * @param array $options
     * @return Builder|PostType
     */
    public function get(Request $request, $options = [])
    {
        $query_options = array_merge(
            [
                'date' => date('Y-m-d H:i:s'),
                'order' => 'created_at-1',
                'with' => [],
                'type' => null,
                'ids' => -1,
                'exclude_ids' => -1,
                'search' => null,
            ],
            $request->input(),
            $options
        );

        $query = PostType::with($query_options['with'])
            ->isBefore($query_options['date'])
            ->isOrdered($query_options['order']);

        if ($query_options['type'] !== null) {
            $query->isType($query_options['type']);
        }

        if ($query_options['ids'] !== -1) {
            $query->within($query_options['ids']);
        }

        if ($query_options['exclude_ids'] !== -1) {
            $query->withinNot($query_options['exclude_ids']);
        }

        if ($query_options['search'] !== null && is_array($query_options['search']) === true) {
            $query->search(key($query_options['search']), current($query_options['search']));
        }

        return $query;
    }

    /**
     * List posts types
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function list(Request $request)
    {
        return PostTypeResource::collection($this->get($request, ['with' => $this->with])->paginate());
    }

    /**
     * Get post type
     *
     * @param Request $request
     * @param PostType $post_type
     * @return PostTypeResource
     */
    public function one(Request $request, PostType $post_type)
    {
        return new PostTypeResource($post_type->load($this->with));
    }

    /**
     * Create post type
     *
     * @param PostTypeRequest $request
     * @return PostTypeResource
     */
    public function create(PostTypeRequest $request)
    {
        $post_type = new PostType();
        $post_type->updateData($request->all());

        return $this->one($request, $post_type->fresh());
    }

    /**
     * Update post type
     *
     * @param PostTypeRequest $request
     * @param PostType $post_type
     * @return PostTypeResource
     */
    public function oneUpdate(PostTypeRequest $request, PostType $post_type)
    {
        $post_type->updateData($request->all());

        return $this->one($request, $post_type);
    }

    /**
     * Active post type
     *
     * @param Request $request
     * @param PostType $post_type
     * @return PostTypeResource
     */
    public function oneActive(Request $request, PostType $post_type)
    {
        $post_type->setActive(true);

        return $this->one($request, $post_type);
    }

    /**
     * Inactive post type
     *
     * @param Request $request
     * @param PostType $post_type
     * @return PostTypeResource
     */
    public function oneInactive(Request $request, PostType $post_type)
    {
        $post_type->setActive(false);

        return $this->one($request, $post_type);
    }

    /**
     * Delete post type
     *
     * @param Request $request
     * @param PostType $post_type
     * @return PostTypeResource
     * @throws Exception
     */
    public function oneDelete(Request $request, PostType $post_type)
    {
        $post_type->delete();

        return $this->one($request, $post_type);
    }
}
