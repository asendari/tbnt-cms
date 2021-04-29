<?php

namespace Tbnt\Cms\Http\Controllers\Api\Admin;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Http\Resources\Admin\ContactResource;
use Tbnt\Cms\Model\Contact;

class ContactController extends BaseController
{
    /**
     * Get contacts
     *
     * @param Request $request
     * @param array $options
     * @return Builder|Contact
     */
    public function get(Request $request, $options = [])
    {
        $query_options = array_merge(
            [
                'date' => date('Y-m-d H:i:s'),
                'order' => 'created_at-1',
                'search' => '',
            ],
            $request->input(),
            $options
        );

        $query = Contact::isOrdered($query_options['order']);

        if ($query_options['search'] !== '') {
            $query->hasSearch($query_options['search']);
        }

        return $query;
    }

    /**
     * List contacts
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function list(Request $request)
    {
        return ContactResource::collection($this->get($request)->paginate());
    }
}
