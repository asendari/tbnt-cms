<?php

namespace Tbnt\Cms\Http\Requests\Admin;

use Illuminate\Validation\Validator;
use Tbnt\Cms\Http\Requests\BaseRequest;

class PostTypeRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'config' => 'array',
            'config.modes' => 'array',
            'config.modes.*' => 'required|numeric|in:0',
            'config.order' => 'string',
            'config.override' => 'array',
            'config.override.*' => 'required|string_numeric',
            'config.required' => 'array',
            'config.required.*' => 'required|string',
            'is_loaded' => 'boolean',
            'is_page' => 'boolean',
            'items' => 'array',
            'items.*' => 'array',
            'has_key' => 'boolean|required_unless:mode,3',
            'label' => 'string',
            'mode' => 'required|numeric|in:1,2,3',
            'type' => 'required|string',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param Validator $validator
     * @return void
     */
    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $check_items = function ($items) use (&$check_items, &$validator) {
                foreach ($items as $i => $item) {
                    $index = implode('.', ['items', $item['id'] ?? '']);

                    $array = [];

                    data_set($array, $index, $item);

                    $items_validator = \Validator::make($array, [
                        $index . '.conditions' => 'array',
                        $index . '.conditions.*' => 'array|min:1',
                        $index . '.conditions.*.*' => 'string_numeric',
                        $index . '.config' => 'array',
                        $index . '.config.value' => 'string_numeric',
                        $index . '.id' => 'required|string_numeric',
                        $index . '.key' => 'required|slug',
                        $index . '.label' => 'string',
                        $index . '.mode' => 'numeric|in:0,1,2,3',
                        $index . '.restrictions' => 'array',
                        $index . '.restrictions.*' => 'string_numeric',
                        $index . '.type' => 'required|string',
                    ]);

                    $validate_items_type = function ($types) use ($index) {
                        return function ($input) use ($index, $types) {
                            return in_array(arr()->get($input, $index . '.type'), $types);
                        };
                    };

                    $invalidate_items_type = function ($types) use ($index) {
                        return function ($input) use ($index, $types) {
                            return in_array(arr()->get($input, $index . '.type'), $types) === false;
                        };
                    };

                    $items_validator->sometimes(
                        [$index . '.config.count'],
                        'numeric',
                        $validate_items_type(['checkbox', 'rows', 'selectmultiple'])
                    );
                    $items_validator->sometimes(
                        [$index . '.config.min'],
                        'string_numeric',
                        $validate_items_type([
                            'checkbox',
                            'date',
                            'datetime',
                            'encrypted',
                            'number',
                            'rows',
                            'selectmultiple',
                            'text',
                            'textarea',
                            'time',
                            'wysiwyg',
                        ])
                    );
                    $items_validator->sometimes(
                        [$index . '.config.max'],
                        'string_numeric',
                        $validate_items_type([
                            'checkbox',
                            'date',
                            'datetime',
                            'encrypted',
                            'file',
                            'number',
                            'rows',
                            'selectmultiple',
                            'text',
                            'textarea',
                            'time',
                            'wysiwyg',
                        ])
                    );
                    $items_validator->sometimes([$index . '.config.step'], 'numeric', $validate_items_type(['number']));
                    $items_validator->sometimes([$index . '.config.posts'], 'array|required', $validate_items_type(['post']));
                    $items_validator->sometimes([$index . '.config.posts.id'], 'string_numeric', $validate_items_type(['post']));
                    $items_validator->sometimes([$index . '.config.posts.key'], 'string', $validate_items_type(['post']));
                    $items_validator->sometimes([$index . '.config.posts.label'], 'string', $validate_items_type(['post']));
                    $items_validator->sometimes(
                        [$index . '.config.posts.type'],
                        'string|required',
                        $validate_items_type(['post'])
                    );
                    $items_validator->sometimes([$index . '.config.type'], 'string|required', $validate_items_type(['post']));
                    $items_validator->sometimes([$index . '.config.accept'], 'string|required', $validate_items_type(['file']));
                    $items_validator->sometimes(
                        [$index . '.config.cast'],
                        'string',
                        $validate_items_type(['checkbox', 'encrypted', 'number', 'radio', 'select', 'selectmultiple', 'text'])
                    );
                    $items_validator->sometimes(
                        [$index . '.config.items'],
                        'array',
                        $validate_items_type(['checkbox', 'group', 'radio', 'rows', 'select', 'selectmultiple'])
                    );
                    $items_validator->sometimes(
                        [$index . '.config.items.*'],
                        'array|required',
                        $validate_items_type(['checkbox', 'group', 'radio', 'rows', 'select', 'selectmultiple'])
                    );
                    $items_validator->sometimes([$index . '.config.wysiwyg'], 'array', $validate_items_type(['wysiwyg']));
                    $items_validator->sometimes(
                        [$index . '.is_required'],
                        'boolean|required',
                        $invalidate_items_type(['empty', 'group'])
                    );
                    $items_validator->sometimes(
                        [$index . '.is_translatable'],
                        'boolean|required',
                        $invalidate_items_type(['empty', 'group'])
                    );

                    if ($items_validator->fails() === true) {
                        $validator->errors()->merge($items_validator->messages());
                    }

                    $check_items($item['items'] ?? null ?: [], $index);
                }
            };

            $check_items($this->input('items', []));
        });
    }
}
