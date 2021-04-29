<?php

namespace Tbnt\Cms\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Tbnt\Cms\Model\PostItem;

class PostItemsRecursiveResource extends ResourceCollection
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
     * @return mixed
     */
    public function getData($data)
    {
        return $data->reduce(function ($carry, $item) {
            if ($item->value_type === 'group') {
                $carry[$item->post_type_item->key] = [
                    'id' => $item->id,
                    'items' => $this->getData($item->post_items_recursive),
                ];
            } elseif ($item->value_type === 'rows') {
                if (isset($carry[$item->post_type_item->key]) === false) {
                    $carry[$item->post_type_item->key] = [];
                }

                array_push($carry[$item->post_type_item->key], [
                    'id' => $item->id,
                    'items' => $this->getData($item->post_items_recursive),
                ]);
            } else {
                $carry[$item->post_type_item->key] = [
                    'id' => $item->id,
                    'value' => $this->getFormattedValue($item, $item->formatted_value),
                    'trans' => $item->post_type_item->is_translatable === true ? $this->getFormattedTrans($item) : null,
                ];
            }

            return $carry;
        }, []);
    }

    /**
     * Format value
     *
     * @param PostItem $item
     * @param mixed $value
     * @return mixed
     */
    public function getFormattedValue(PostItem $item, $value = null)
    {
        return $item->value_type === 'datetime'
            ? to_iso8601_string($value)
            : ($item->value_type === 'file'
                ? new FileResource($value)
                : $value);
    }

    /**
     * Format trans
     *
     * @param PostItem $item
     * @return mixed
     */
    public function getFormattedTrans(PostItem $item)
    {
        return array_map(function ($value) use ($item) {
            return $this->getFormattedValue($item, $value);
        }, $item->formatted_trans);
    }
}
