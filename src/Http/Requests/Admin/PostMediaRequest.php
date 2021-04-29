<?php

namespace Tbnt\Cms\Http\Requests\Admin;

use Illuminate\Validation\Validator;
use Tbnt\Cms\Http\Requests\BaseRequest;

class PostMediaRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'media' => 'array',
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
            $media = $this->all()['media'] ?? [];

            $fields_rules = [];
            $fields_values = [];

            foreach ($media as $post_item_id => $value) {
                $post_type_item = optional($post->post_items()->find($post_item_id))->post_type_item;

                if ($post_type_item === null) {
                    continue;
                }

                $rules = [];

                array_push($rules, 'file_valid|file_size|image_size|image_dimensions');

                if (($post_type_item->data->max ?? null) !== null) {
                    array_push($rules, 'max:' . $post_type_item->data->max);
                }
                if (($post_type_item->data->accept ?? null) !== null) {
                    array_push($rules, 'file_mimes:' . str_replace('.', '', $post_type_item->data->accept));
                }

                $fields_rules['fields.' . $post_item_id] = implode('|', $rules);
                $fields_values[$post_item_id] = $value;
            }

            $media_validator = \Validator::make(['fields' => $fields_values], $fields_rules);

            if ($media_validator->fails() === true) {
                $validator->errors()->merge($media_validator->messages());
            }
        });
    }
}
