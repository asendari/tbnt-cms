@yield('content')

{{ __('cms::emails/defaults.end_message', ['name' => app_name()], $lang_code ?? '') }}

{{ __('cms::emails/defaults.copyright', [], $lang_code ?? '') }}
