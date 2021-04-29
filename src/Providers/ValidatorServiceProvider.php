<?php

namespace Tbnt\Cms\Providers;

use Illuminate\Support\ServiceProvider;
use Validator;

class ValidatorServiceProvider extends ServiceProvider
{
    /**
     * Register bindings in the container.
     *
     * @return void
     */
    public function boot()
    {
        /*
        |--------------------------------------------------------------------------
        | Date must be before or equal from :date_to (default: now())
        |--------------------------------------------------------------------------
        |
        | date_check:['before'|'before_equal'|'after'|'after_equal'],['date'|'datetime'],date_to
        |
        */

        Validator::extend('date_check', function ($attribute, $value, $parameters, $validator) {
            $dir = $parameters[0];
            $type = ($parameters[1] ?? 'datetime') === 'date' ? 'to_date_string' : 'to_datetime_string';
            $check = $parameters[2] ?? now();

            switch ($dir) {
                case 'before':
                    return strtotime($type($check)) > strtotime($type($value));
                case 'before_equal':
                    return strtotime($type($check)) >= strtotime($type($value));
                case 'after':
                    return strtotime($type($check)) < strtotime($type($value));
                case 'after_equal':
                    return strtotime($type($check)) <= strtotime($type($value));
                default:
                    return strtotime(to_date_string($parameters[0] ?? now())) >= strtotime($value);
            }
        });

        Validator::replacer('date_check', function ($message, $attribute, $rule, $parameters) {
            $dir = $parameters[0];
            $type = ($parameters[1] ?? 'datetime') === 'date' ? 'to_date_string' : 'to_datetime_string';
            $check = $parameters[2] ?? now();

            return str_replace([':dir', ':date'], [__('cms::validation.' . $dir), $type($check)], $message);
        });

        /*
        |--------------------------------------------------------------------------
        | Date/time must be a valid carbon date string
        |--------------------------------------------------------------------------
        |
        | carbon
        |
        */

        Validator::extend('carbon', function ($attribute, $value, $parameters, $validator) {
            return is_date_valid($value);
        });

        /*
        |--------------------------------------------------------------------------
        | Time must be in format H:i
        |--------------------------------------------------------------------------
        |
        | datetime
        |
        */

        Validator::extend('datetime', function ($attribute, $value, $parameters, $validator) {
            return Validator::make(['datetime' => $value], ['datetime' => 'date_format:"Y-m-d H:i:s"'])->passes();
        });

        /*
        |--------------------------------------------------------------------------
        | Time must be in format H:i
        |--------------------------------------------------------------------------
        |
        | time
        |
        */

        Validator::extend('time', function ($attribute, $value, $parameters, $validator) {
            return Validator::make(['time' => $value], ['time' => 'date_format:"H:i"'])->passes() ||
                Validator::make(['time' => $value], ['time' => 'date_format:"H:i:s"'])->passes();
        });

        /*
        |--------------------------------------------------------------------------
        | The field under validation must not be empty when it is present
        | if the anotherfield field is equal to any value.
        |--------------------------------------------------------------------------
        |
        | filled_if:anotherfield,value
        |
        */

        Validator::extendImplicit('filled_if', function ($attribute, $value, $parameters, $validator) {
            if ($value === null) {
                return true;
            }
            if (isset($validator->attributes()[$parameters[0]]) === false) {
                return false;
            }

            return $validator->attributes()[$parameters[0]] !== $parameters[1] || trim($value) !== '';
        });

        Validator::replacer('filled_if', function ($message, $attribute, $rule, $parameters) {
            return str_replace([':other', ':value'], [$parameters[0], $parameters[1]], $message);
        });

        /*
        |--------------------------------------------------------------------------
        | Gender is "male" or "female"
        |--------------------------------------------------------------------------
        |
        | gender
        |
        */

        Validator::extend('gender', function ($attribute, $value, $parameters, $validator) {
            return in_array($value, ['male', 'female']);
        });

        /*
        |--------------------------------------------------------------------------
        | String must be numeric or string
        |--------------------------------------------------------------------------
        |
        | string_numeric
        |
        */

        Validator::extend('string_numeric', function ($attribute, $value, $parameters, $validator) {
            return Validator::make(['string' => $value], ['string' => 'string'])->passes() ||
                Validator::make(['numeric' => $value], ['numeric' => 'numeric'])->passes();
        });

        /*
        |--------------------------------------------------------------------------
        | String must be formated as a slug
        |--------------------------------------------------------------------------
        |
        | slug
        |
        */

        Validator::extend('slug', function ($attribute, $value, $parameters, $validator) {
            return Validator::make(['string' => $value], ['string' => ['string', 'regex:/^[a-z0-9\-]+$/']])->passes();
        });

        /*
        |--------------------------------------------------------------------------
        | String must not contains invalid UTF-8 characters
        |--------------------------------------------------------------------------
        |
        | package: neitanod/forceutf8
        |
        | is_utf8_malformed
        |
        */

        // Validator::extend('is_utf8_malformed', function ($attribute, $value, $parameters, $validator) {
        //     return $value === '' || $value === Encoding::fixUTF8($value);
        // });

        /*
        |--------------------------------------------------------------------------
        | ReCaptcha should succeed
        |--------------------------------------------------------------------------
        |
        | recaptcha
        |
        */

        Validator::extend('recaptcha', function ($attribute, $value, $parameters, $validator) {
            return \Tbnt\Cms\Utils\Google\ReCaptchaGoogleUtils::verify($value);
        });

        /*
        |--------------------------------------------------------------------------
        | Geocode should succeed
        |--------------------------------------------------------------------------
        |
        | geocode_success
        |
        */

        Validator::extend('geocode_success', function ($attribute, $value, $parameters, $validator) {
            return \Tbnt\Cms\Utils\Google\AddressGoogleUtils::geocode($value) !== false;
        });

        /*
        |--------------------------------------------------------------------------
        | Lang id must exists
        |--------------------------------------------------------------------------
        |
        | lang_id_exists
        |
        */

        Validator::extend('lang_id_exists', function ($attribute, $value, $parameters, $validator) {
            return lang()->exists($value);
        });

        /*
        |--------------------------------------------------------------------------
        | Lang code must exists
        |--------------------------------------------------------------------------
        |
        | lang_code_exists
        |
        */

        Validator::extend('lang_code_exists', function ($attribute, $value, $parameters, $validator) {
            return lang()->codeExists($value);
        });

        /*
        |--------------------------------------------------------------------------
        | File extension is valid
        |--------------------------------------------------------------------------
        |
        | file_valid
        |
        */

        Validator::extend('file_valid', function ($attribute, $value, $parameters, $validator) {
            return Validator::make(
                ['file' => $value],
                ['file' => 'file|file_mimes:' . config('cmsfile.valid_extensions')]
            )->passes();
        });

        /*
        |--------------------------------------------------------------------------
        | File extension is valid
        |--------------------------------------------------------------------------
        |
        | file_mimes
        |
        */

        Validator::extend('file_mimes', function ($attribute, $value, $parameters, $validator) {
            if (is_string($value) === true) {
                return true;
            }

            $mimes = array_map(function ($m) {
                return trim($m, '.');
            }, $parameters);

            if ((in_array('jpg', $mimes) === true || in_array('jpe', $mimes) === true) && in_array('jpeg', $mimes) === false) {
                array_push($mimes, 'jpeg');
            }

            return Validator::make(['file' => $value], ['file' => 'mimes:' . implode(',', $mimes)])->passes();
        });

        /*
        |--------------------------------------------------------------------------
        | File update
        |--------------------------------------------------------------------------
        |
        | file_update
        |
        */

        Validator::extend('file_update', function ($attribute, $value, $parameters, $validator) {
            if (is_string($value) === true && $value !== 'delete') {
                return true;
            }

            return is_object($value) && get_class($value) === 'Illuminate\Http\UploadedFile';
        });

        /*
        |--------------------------------------------------------------------------
        | File update delete
        |--------------------------------------------------------------------------
        |
        | file_update_delete
        |
        */

        Validator::extend('file_update_delete', function ($attribute, $value, $parameters, $validator) {
            if (is_string($value) === true) {
                return true;
            }

            return is_object($value) && get_class($value) === 'Illuminate\Http\UploadedFile';
        });

        /*
        |--------------------------------------------------------------------------
        | File must be max size
        |--------------------------------------------------------------------------
        |
        | file_size
        |
        */

        Validator::extend('file_size', function ($attribute, $value, $parameters, $validator) {
            if (is_string($value) === true) {
                return true;
            }

            return Validator::make(['file' => $value], ['file' => 'max:' . media()->getFileMaxSize()])->passes();
        });

        /*
        |--------------------------------------------------------------------------
        | Image must be max size
        |--------------------------------------------------------------------------
        |
        | image_size
        |
        */

        Validator::extend('image_size', function ($attribute, $value, $parameters, $validator) {
            if (is_string($value) === true || media()->isImage($value) === false) {
                return true;
            }

            return Validator::make(['image' => $value], ['image' => 'max:' . media()->getImageMaxSize()])->passes();
        });

        /*
        |--------------------------------------------------------------------------
        | Image must be max dimensions
        |--------------------------------------------------------------------------
        |
        | image_dimensions
        |
        */

        Validator::extend('image_dimensions', function ($attribute, $value, $parameters, $validator) {
            if (is_string($value) === true || media()->isImage($value) === false) {
                return true;
            }

            $width = media()->getImageMaxWidth();

            return in_array($value->getClientOriginalExtension(), ['svg']) === true ||
                Validator::make(
                    ['image' => $value],
                    ['image' => 'dimensions:max_width=' . $width . ',max_height=' . $width . '']
                )->passes();
        });

        /*
        |--------------------------------------------------------------------------
        | Post must exists
        |--------------------------------------------------------------------------
        |
        | post_exists
        |
        */

        Validator::extend('post_exists', function ($attribute, $value, $parameters, $validator) {
            return \Tbnt\Cms\Model\Post::isValid()->find($value) !== null;
        });

        /*
        |--------------------------------------------------------------------------
        | Post must be of type
        |--------------------------------------------------------------------------
        |
        | post_type
        |
        */

        Validator::extend('post_type', function ($attribute, $value, $parameters, $validator) {
            return \Tbnt\Cms\Model\Post::isValid()
                ->hasType($parameters)
                ->find($value) !== null;
        });

        /*
        |--------------------------------------------------------------------------
        | User email must be unique
        | (either it does not exists, or already exists for parameter[0])
        |--------------------------------------------------------------------------
        |
        | user_email_unique
        |
        */

        Validator::extend('user_email_unique', function ($attribute, $value, $parameters, $validator) {
            $query = \Tbnt\Cms\Model\User::where('username', $value);

            if (isset($parameters[0]) === true) {
                $query->where(is_numeric($parameters[0]) === true ? 'id' : 'username', '!=', $parameters[0]);
            }

            return $query->first() === null;
        });

        /*
        |--------------------------------------------------------------------------
        | User must exists
        |--------------------------------------------------------------------------
        |
        | user_exists
        |
        */

        Validator::extend('user_exists', function ($attribute, $value, $parameters, $validator) {
            return \Tbnt\Cms\Model\User::find($value) !== null;
        });

        /*
        |--------------------------------------------------------------------------
        | Country must exists
        |--------------------------------------------------------------------------
        |
        | country_exists
        |
        */

        Validator::extend('country_exists', function ($attribute, $value, $parameters, $validator) {
            return \Tbnt\Cms\Model\Country::isActive()->find($value) !== null;
        });
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
