@extends('cms::emails.app.plain')

@section('content')
{{ __('cms::emails/new-password.title', [], $lang_code) }}

{{ __('cms::emails/new-password.message', [], $lang_code) }}

{{ __('cms::emails/new-password.password', [], $lang_code) }}
{{ $password }}

{{ __('cms::emails/new-password.button', [], $lang_code) }}
{{ $signin_link }}
@endsection
