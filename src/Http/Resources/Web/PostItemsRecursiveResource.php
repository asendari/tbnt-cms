<?php

namespace Tbnt\Cms\Http\Resources\Web;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;
use Tbnt\Cms\Model\PostItem;

class PostItemsRecursiveResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return $this->getData($this->resource);
    }

    /**
     * Transform the resource into an array.
     *
     * @param mixed $data
     * @return array
     */
    public function getData($data)
    {
        return $data->reduce(function ($carry, $item) {
            if ($item->value_type === 'group') {
                $carry[$item->post_type_item->key] = $this->getData($item->post_items_recursive);
            } elseif ($item->value_type === 'rows') {
                $carry[$item->post_type_item->key][] = $this->getData($item->post_items_recursive);
            } else {
                $carry[$item->post_type_item->key] = $this->getFormattedValue($item);
            }

            return $carry;
        }, []);
    }

    /**
     * Format value
     *
     * @param PostItem $item
     * @return mixed
     */
    public function getFormattedValue(PostItem $item)
    {
        return $item->value_type === 'encrypted'
            ? to_bool($item->formatted_value)
            : ($item->value_type === 'datetime'
                ? to_iso8601_string($item->formatted_value)
                : ($item->value_type === 'file'
                    ? new FileResource($item->formatted_value)
                    : $item->formatted_value));
    }
}
