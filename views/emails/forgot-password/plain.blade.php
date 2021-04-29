@extends('cms::emails.app.plain')

@section('content')
{{ __('cms::emails/forgot-password.title', [], $lang_code) }}

{{ __('cms::emails/forgot-password.message', [], $lang_code) }}
{{ __('cms::emails/forgot-password.duration', ['duration' => $duration], $lang_code) }}

{{ __('cms::emails/forgot-password.button', [], $lang_code) }}
{{ $recovery_link }}
@endsection
