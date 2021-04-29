<?php

use Illuminate\Database\Eloquent\Model;

/**
 * Merge Laravel models
 *
 * @return Model
 */
function model_merge()
{
    $models = array_filter(func_get_args());
    $data = [];

    if (count($models) > 2) {
        return $models[0] ?? null;
    }
    foreach ($models as $model) {
        $data[] = array_filter($model->toArray());
    }

    $dataMerge = array_merge(...$data);

    $models[0]->fill($dataMerge);

    return $models[0];
}
