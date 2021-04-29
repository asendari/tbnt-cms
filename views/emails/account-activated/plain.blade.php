@extends('cms::emails.app.plain')

@section('content')
{{ __('cms::emails/account-activated.title', [], $lang_code) }}

{{ __('cms::emails/account-activated.message', [], $lang_code) }}
{{ __('cms::emails/account-activated.duration', ['duration' => $duration], $lang_code) }}

{{ __('cms::emails/account-activated.button', [], $lang_code) }}
{{ $recovery_link }}
@endsection
