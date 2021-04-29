<?php

namespace Tbnt\Cms\Http\Requests\Admin;

use Illuminate\Validation\Validator;
use Tbnt\Cms\Http\Requests\BaseRequest;

class PostRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $post_id = optional($this->route('postId'))->id;

        return [
            'title' => 'string',
            'description' => 'string',
            'url' => 'string',
            'post_id' => 'string_numeric' . ($post_id ? '|not_in:' . $post_id : ''),
            'is_indexable' => 'boolean',
            'is_visible' => 'boolean',
            'modes' => 'array',
            'reference' => 'required|string',
            'visible_at' => 'carbon',
            'hidden_at' => 'carbon',
            'position' => 'numeric',
            'fields' => 'array',
            'lang_code' => 'required|string',
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
            $post = $this->route('postId');
            $post_id = $post->id ?? null;
            $post_type = $post === null ? $this->route('postType') : $post->post_type;
            $post_data = $post === null ? $post_type->data : $post->combined_data;

            $request_all = $this->all();
            $validate_lang = $this->input('lang_code') === lang()->getDefaultCode();
            $user_is_superadmin = auth()->user()->profile->is_superadmin;

            $post_data_required = $post_data->get('required', []);
            $post_data_override = $post_data->get('override', []);
            $post_data_superadmin =
                $user_is_superadmin === true
                    ? []
                    : array_keys(
                        array_filter($post_data->get('modes', []), function ($mode) {
                            return $mode < 2;
                        })
                    );

            if ($post_type->has_key === true && $user_is_superadmin === true) {
                array_push($post_data_required, 'key');
            }
            if ($post_type->is_page === true) {
                array_push($post_data_required, 'title', 'description', 'url');
            }

            // Validate post values
            foreach ($post_data_superadmin as &$key) {
                arr()->forget($request_all, $key);
            }
            foreach ($post_data_override as $key => &$value) {
                arr()->set($request_all, $key, $value);
            }

            $post_validator = \Validator::make($request_all, []);

            foreach ($post_data_required as $data_required) {
                if (
                    in_array($data_required, $post_data_superadmin) === true ||
                    (in_array($data_required, ['title', 'description', 'url']) === true && $validate_lang === false)
                ) {
                    continue;
                }

                $post_validator->sometimes([$data_required], 'required', function () {
                    return true;
                });
            }

            if (isset($post_data->parent_post_type) === true) {
                $post_validator->sometimes(['post_id'], 'post_type:' . $post_data->parent_post_type, function () {
                    return true;
                });
            }

            if ($post_validator->fails() === true) {
                $validator->errors()->merge($post_validator->messages());
            }

            // Validate post fields
            $fields_rules = [];
            $fields_values = [];
            $fields_unknown = [];

            $check_items_values = function ($items, $values) use (
                &$check_items_values,
                &$fields_rules,
                &$fields_values,
                $post_id,
                $validate_lang,
                $user_is_superadmin
            ) {
                foreach ($items as $item) {
                    if (
                        ($item->mode === 0 && $user_is_superadmin === false) ||
                        ($item->post_type_item_restrictions->count() !== 0 &&
                            ($post_id === null || $item->post_type_item_restrictions->firstWhere('post_id', $post_id) === null))
                    ) {
                        $values = array_filter($values, function ($v) use ($item) {
                            return strval($v['post_type_item_id'] ?? '') !== $item->id;
                        });
                        continue;
                    }

                    if ($item->type === 'group') {
                        $check_items_values($item->post_type_items, $values[$item->key]['items'] ?? []);
                        continue;
                    }

                    $rules = [];

                    $item_type = $item->type === 'post' ? $item->data->type : $item->type;

                    $is_required = $item->is_required === true && ($item->is_translatable === false || $validate_lang === true);

                    if ($is_required === true) {
                        array_push($rules, 'required');
                    }

                    $value = arr()->first(
                        $values,
                        function ($v) use ($item) {
                            return strval($v['post_type_item_id'] ?? '') === $item->id;
                        },
                        null
                    );

                    $key = $value['id'] ?? ($value['key'] ?? '') ?: 'unknown';

                    if ($value !== null) {
                        if (in_array($item_type, ['rows', 'checkbox', 'selectmultiple'])) {
                            array_push($rules, 'array');

                            if (($item->data->count ?? null) !== null) {
                                array_push($rules, 'size:' . $item->data->count);
                            } else {
                                if (($item->data->min ?? null) !== null) {
                                    array_push($rules, 'min:' . $item->data->min, 'required');
                                }
                                if (($item->data->max ?? null) !== null) {
                                    array_push($rules, 'max:' . $item->data->max);
                                }
                            }

                            if ($item_type === 'rows') {
                                foreach ($value['value'] ?? [] as $row) {
                                    $check_items_values($item->post_type_items, $row['items']);
                                }
                            } elseif ($is_required === true && ($item->data->min ?? null) === null) {
                                array_push($rules, 'min:1');
                            }
                        } elseif (in_array($item_type, ['file'])) {
                            // array_push($rules, 'file_valid|image_dimensions');

                            // if (($item->data->max ?? null) !== null) array_push($rules, 'max:'.$item->data->max);
                            // if (($item->data->accept ?? null) !== null) array_push($rules, 'file_mimes:'.str_replace('.', '', $item->data->accept));

                            // if ($is_required === true) array_push($rules, 'file_update');
                            // else array_push($rules, 'file_update_delete');
                        } else {
                            switch ($item_type) {
                                case 'number':
                                    array_push($rules, 'numeric');
                                    break;
                                case 'email':
                                    array_push($rules, 'email');
                                    break;
                                case 'date':
                                    array_push($rules, 'date');
                                    break;
                                case 'datetime':
                                    array_push($rules, 'carbon');
                                    break;
                                case 'time':
                                    array_push($rules, 'time');
                                    break;
                                case 'url':
                                    array_push($rules, 'url');
                                    break;
                                default:
                                    break;
                            }

                            if ($is_required === true) {
                                array_push($rules, 'filled');
                            }
                        }

                        $fields_rules['fields.' . $key] = implode('|', $rules);
                        $fields_values[$key] = $value['value'] ?? null;
                    } else {
                        $fields_unknown[] = $key;
                    }
                }
            };

            $check_items_values($post_type->post_type_items_recursive, $this->input('fields', []));

            $fields_validator = \Validator::make(['fields' => $fields_values], $fields_rules);
            $fields_unknown_validator = \Validator::make(
                ['fields_unknown' => $fields_unknown],
                ['fields_unknown' => 'array|max:0']
            );

            if ($fields_validator->fails() === true) {
                $validator->errors()->merge($fields_validator->messages());
            }
            if ($fields_unknown_validator->fails() === true) {
                $validator->errors()->merge($fields_unknown_validator->messages());
            }
        });
    }
}
