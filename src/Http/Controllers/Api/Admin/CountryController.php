<?php

namespace Tbnt\Cms\Http\Controllers\Api\Admin;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Tbnt\Cms\Http\Controllers\BaseController;
use Tbnt\Cms\Http\Requests\Admin\CountryRequest;
use Tbnt\Cms\Http\Resources\Admin\CountryResource;
use Tbnt\Cms\Model\Country;

class CountryController extends BaseController
{
    /**
     * Get countries
     *
     * @param Request $request
     * @param array $options
     * @return Builder|Country
     */
    public function get(Request $request, $options = [])
    {
        $query_options = array_merge(
            [
                'date' => date('Y-m-d H:i:s'),
                'order' => 'name-0',
                'ids' => -1,
                'search' => '',
            ],
            $request->input(),
            $options
        );

        $query = Country::isOrdered($query_options['order']);

        if ($query_options['ids'] !== -1) {
            $query->within($query_options['ids']);
        }

        return $query;
    }

    /**
     * List countries
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function list(Request $request)
    {
        return CountryResource::collection($this->get($request)->paginate());
    }

    /**
     * Get country
     *
     * @param Request $request
     * @param Country $country
     * @return CountryResource
     */
    public function one(Request $request, Country $country)
    {
        return new CountryResource($country);
    }

    /**
     * Send forgotten password email to country
     *
     * @param CountryRequest $request
     * @param Country $country
     * @return CountryResource
     */
    public function oneUpdate(CountryRequest $request, Country $country)
    {
        $country->updateData($request->all());

        return $this->one($request, $country);
    }

    /**
     * Active country
     *
     * @param Request $request
     * @param Country $country
     * @return CountryResource
     */
    public function oneActive(Request $request, Country $country)
    {
        $country->setActive(true);

        return $this->one($request, $country);
    }

    /**
     * Inactive country
     *
     * @param Request $request
     * @param Country $country
     * @return CountryResource
     */
    public function oneInactive(Request $request, Country $country)
    {
        $country->setActive(false);

        return $this->one($request, $country);
    }
}
