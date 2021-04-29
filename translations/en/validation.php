<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'The :attribute must be accepted.',
    'active_url' => 'The :attribute is not a valid URL.',
    'after' => 'The :attribute must be a date after :date.',
    'after_or_equal' => 'The :attribute must be a date after or equal to :date.',
    'alpha' => 'The :attribute may only contain letters.',
    'alpha_dash' => 'The :attribute may only contain letters, numbers, dashes and underscores.',
    'alpha_num' => 'The :attribute may only contain letters and numbers.',
    'array' => 'The :attribute must be an array.',
    'before' => 'The :attribute must be a date before :date.',
    'before_or_equal' => 'The :attribute must be a date before or equal to :date.',
    'between' => [
        'numeric' => 'The :attribute must be between :min and :max.',
        'file' => 'The :attribute must be between :min and :max kilobytes.',
        'string' => 'The :attribute must be between :min and :max characters.',
        'array' => 'The :attribute must have between :min and :max items.',
    ],
    'boolean' => 'The :attribute field must be true or false.',
    'confirmed' => 'The :attribute confirmation does not match.',
    'date' => 'The :attribute is not a valid date.',
    'date_equals' => 'The :attribute must be a date equal to :date.',
    'date_format' => 'The :attribute does not match the format :format.',
    'different' => 'The :attribute and :other must be different.',
    'digits' => 'The :attribute must be :digits digits.',
    'digits_between' => 'The :attribute must be between :min and :max digits.',
    'dimensions' => 'The :attribute has invalid image dimensions.',
    'distinct' => 'The :attribute field has a duplicate value.',
    'email' => 'The :attribute must be a valid email address.',
    'ends_with' => 'The :attribute must end with one of the following: :values',
    'exists' => 'The selected :attribute is invalid.',
    'file' => 'The :attribute must be a file.',
    'filled' => 'The :attribute field must have a value.',
    'gt' => [
        'numeric' => 'The :attribute must be greater than :value.',
        'file' => 'The :attribute must be greater than :value kilobytes.',
        'string' => 'The :attribute must be greater than :value characters.',
        'array' => 'The :attribute must have more than :value items.',
    ],
    'gte' => [
        'numeric' => 'The :attribute must be greater than or equal :value.',
        'file' => 'The :attribute must be greater than or equal :value kilobytes.',
        'string' => 'The :attribute must be greater than or equal :value characters.',
        'array' => 'The :attribute must have :value items or more.',
    ],
    'image' => 'The :attribute must be an image.',
    'in' => 'The selected :attribute is invalid.',
    'in_array' => 'The :attribute field does not exist in :other.',
    'integer' => 'The :attribute must be an integer.',
    'ip' => 'The :attribute must be a valid IP address.',
    'ipv4' => 'The :attribute must be a valid IPv4 address.',
    'ipv6' => 'The :attribute must be a valid IPv6 address.',
    'json' => 'The :attribute must be a valid JSON string.',
    'lt' => [
        'numeric' => 'The :attribute must be less than :value.',
        'file' => 'The :attribute must be less than :value kilobytes.',
        'string' => 'The :attribute must be less than :value characters.',
        'array' => 'The :attribute must have less than :value items.',
    ],
    'lte' => [
        'numeric' => 'The :attribute must be less than or equal :value.',
        'file' => 'The :attribute must be less than or equal :value kilobytes.',
        'string' => 'The :attribute must be less than or equal :value characters.',
        'array' => 'The :attribute must not have more than :value items.',
    ],
    'max' => [
        'numeric' => 'The :attribute may not be greater than :max.',
        'file' => 'The :attribute may not be greater than :max kilobytes.',
        'string' => 'The :attribute may not be greater than :max characters.',
        'array' => 'The :attribute may not have more than :max items.',
    ],
    'mimes' => 'The :attribute must be a file of type: :values.',
    'mimetypes' => 'The :attribute must be a file of type: :values.',
    'min' => [
        'numeric' => 'The :attribute must be at least :min.',
        'file' => 'The :attribute must be at least :min kilobytes.',
        'string' => 'The :attribute must be at least :min characters.',
        'array' => 'The :attribute must have at least :min items.',
    ],
    'not_in' => 'The selected :attribute is invalid.',
    'not_regex' => 'The :attribute format is invalid.',
    'numeric' => 'The :attribute must be a number.',
    'password' => 'The password is incorrect.',
    'present' => 'The :attribute field must be present.',
    'regex' => 'The :attribute format is invalid.',
    'required' => 'The :attribute field is required.',
    'required_if' => 'The :attribute field is required when :other is :value.',
    'required_unless' => 'The :attribute field is required unless :other is in :values.',
    'required_with' => 'The :attribute field is required when :values is present.',
    'required_with_all' => 'The :attribute field is required when :values are present.',
    'required_without' => 'The :attribute field is required when :values is not present.',
    'required_without_all' => 'The :attribute field is required when none of :values are present.',
    'same' => 'The :attribute and :other must match.',
    'size' => [
        'numeric' => 'The :attribute must be :size.',
        'file' => 'The :attribute must be :size kilobytes.',
        'string' => 'The :attribute must be :size characters.',
        'array' => 'The :attribute must contain :size items.',
    ],
    'starts_with' => 'The :attribute must start with one of the following: :values',
    'string' => 'The :attribute must be a string.',
    'timezone' => 'The :attribute must be a valid zone.',
    'unique' => 'The :attribute has already been taken.',
    'uploaded' => 'The :attribute failed to upload.',
    'url' => 'The :attribute format is invalid.',
    'uuid' => 'The :attribute must be a valid UUID.',

    /*
	|--------------------------------------------------------------------------
	| Custom Validation Language Lines - ValidatorServiceProvider
	|--------------------------------------------------------------------------
	|
	| Custom
	|
	*/

    'carbon' => 'The :attribute field must be a valid date.',
    'date_check' => 'The :attribute must be :dir :date.',
    'datetime' => 'The :attribute field must be a valid datetime.',
    'file_size' => 'The :attribute field is too big (max ' . media()->getFileMaxSize() / 1024 . 'Mo).',
    'file_update' => 'The :attribute field must be a valid uploaded/path file and is required.',
    'file_update_delete' => 'The :attribute field must be a valid uploaded/path file.',
    'file_valid' => 'The :attribute field must be a valid file type.',
    'filled_if' => 'The :attribute field is required when :other is :value.',
    'gender' => 'The gender must be valid gender.',
    'geocode_success' => 'The address could not be geocoded.',
    'image_dimensions' => 'The image is too big (max ' . media()->getImageMaxWidth() . 'x' . media()->getImageMaxWidth() . 'px).',
    'image_size' => 'The image is too big (max ' . media()->getImageMaxSize() / 1024 . 'Mo).',
    'is_utf8_malformed' => 'The :attribute field has invalid characters.',
    'lang_code_exists' => 'The language does not exist.',
    'lang_id_exists' => 'The language does not exist.',
    'post_exists' => 'The :attribute must be a valide post.',
    'post_type' => 'The :attribute must be a valide type.',
    'recaptcha' => 'An error occured while verifying the reCaptcha, please try again.',
    'slug' => 'The :attribute must contains only small letters [a-z] and hyphen [-].',
    'string_numeric' => 'The :attribute field must be a string or a number.',
    'time' => 'The :attribute must be a valide time.',

    /*
	|--------------------------------------------------------------------------
	| Validation Language Lines
	|--------------------------------------------------------------------------
	|
	| Custom
	|
	*/

    'bad_credentials' => 'These credentials do not match our records.',
    'csrf_token' => 'The session is invalid. Please log in again.',
    'logged_out' => 'The session is invalid. Please log in again.',
    'login_fail' => 'The login has failed.',
    'need_reload' => 'The session is invalid. Please log in again.',
    'not_allowed' => 'The request is not allowed.',
    'not_found' => 'The request does not exists.',
    'old_password' => 'The request count limit has been reached. Please contact the festival administrator.',
    'post_too_large' => 'The request is too big.',
    'reset_failed' => 'The reset password has failed. The token is invalid or expired.',
    'token_expired' => 'The session is expired. Please log in again.',
    'token_invalid' => 'The session is invalid. Please log in again.',
    'token_not_provided' => 'The session is expired. Please log in again.',

    'user_active' => 'The user is active.',
    'user_deleted' => 'The user is deleted.',
    'user_email_exists' => 'The email does not exists.',
    'user_email_unique' => 'The email is already used.',
    'user_id_exists' => 'The user does not exists.',
    'user_inactive' => 'The user is not active.',
    'user_is_admin' => 'The user is an admin.',
    'user_is_guest' => 'The user is a guest.',
    'user_not_admin' => 'The user is not an admin.',
    'user_not_exists' => 'The user does not exists or the credentials are incorrect.',
    'user_not_found' => 'The session is invalid. Please log in again.',
    'user_password' => 'The user password is incorrect.',
    'user_password_format' =>
        'The user password format is invalid: min 6 characters and at least one lowercase, one uppercase and one digit.',
    'user_platform_malformed' => 'The user platform is malformed.',
    'user_platform_missing' => 'The user platform is missing.',
    'user_status_active' => 'The user is active.',
    'user_status_banned' => 'The user is banned.',
    'user_status_inactive' => 'The user is inactive.',
    'user_zone_malformed' => 'The user zone is malformed.',
    'user_zone_missing' => 'The user zone is missing.',
    'user_zone_not_admin' => 'The user has no access to admin zone.',

    'file_id_exists' => 'The file does not exist.',
    'image_id_exists' => 'The image does not exist.',

    /*
	|--------------------------------------------------------------------------
	| Custom Validation Language Lines - Project
	|--------------------------------------------------------------------------
	|
	| Custom
	|
	*/

    'after' => 'after',
    'after_equal' => 'after or equal',
    'before' => 'before',
    'before_equal' => 'before or equal',
    'something_went_wrong' => 'A message to display.',

    /*
	|--------------------------------------------------------------------------
	| Custom Validation Language Lines
	|--------------------------------------------------------------------------
	|
	| Here you may specify custom validation messages for attributes using the
	| convention "attribute.rule" to name the lines. This makes it quick to
	| specify a specific custom language line for a given attribute rule.
	|
	*/

    'custom' => [
        'captcha_response' => [
            'required' => 'The captcha is required.',
            'string' => 'The captcha is invalid.',
        ],
        'deleted_files' => [
            'array' => 'Les :attribute is not in a correct format.',
        ],
        'files.*' => [
            'max' => 'The file may not be greater than :max kilobytes.',
        ],
        'image' => [
            'accepted' => 'The image file is required.',
        ],
        'image.*' => [
            'dimensions' => 'The image must have a max width/height of 2400px.',
            'file' => 'The image must be a file.',
        ],
        'lang' => [
            'accepted' => 'At least one language should be specified.',
        ],
        'langs_ids' => [
            'array' => 'The :attribute is not in a correct format.',
        ],
        'pdf' => [
            'accepted' => 'The PDF file is required.',
        ],
        'pdf.*' => [
            'file' => 'The pdf must be a file.',
        ],
        'users_ids' => [
            'array' => 'The :attribute is not in a correct format.',
        ],
    ],

    /*
	|--------------------------------------------------------------------------
	| Custom Validation Attributes
	|--------------------------------------------------------------------------
	|
	| The following language lines are used to swap attribute place-holders
	| with something more reader friendly such as E-Mail Address instead
	| of "email". This simply helps us make messages a little cleaner.
	|
	*/

    'attributes' => [
        'card_ccv' => 'card CCV',
        'card_month' => 'card month',
        'card_number' => 'card number',
        'card_year' => 'card year',
        'comments' => 'comments',
        'country' => 'country',
        'credit_card' => 'credit card',
        'date' => 'date',
        'deleted_files' => 'deleted files',
        'deleted_files.*' => 'deleted file',
        'domain' => 'domain',
        'email' => 'email',
        'file' => 'file',
        'files.*' => 'file',
        'firstname' => 'first name',
        'image' => 'image',
        'is_active' => 'is active',
        'is_admin' => 'administrator',
        'lang_id' => 'language',
        'langs_ids' => 'languages',
        'langs_ids.*' => 'language',
        'language_id' => 'language',
        'lastname' => 'last name',
        'name' => 'name',
        'new_password' => 'new password',
        'password' => 'password',
        'phone' => 'phone',
        'position' => 'position',
        'status' => 'status',
        'street_number' => 'street & number',
        'time_end' => 'time end',
        'time_start' => 'time start',
        'title' => 'title',
        'type' => 'type',
        'url' => 'url',
        'user_id' => 'user',
        'username' => 'username',
        'users_ids' => 'users',
        'users_ids.*' => 'user',
        'website' => 'website',
        'zip_city' => 'ZIP code & city',
    ],
];
