@extends('cms::emails.app.html', [
	'subject' => __('cms::emails/forgot-password.subject', ['name' => app_name()], $lang_code),
])

@section('content')
{{ __('cms::emails/forgot-password.title', [], $lang_code) }}
<br><br>

{{ __('cms::emails/forgot-password.message', [], $lang_code) }}
{{ __('cms::emails/forgot-password.duration', ['duration' => $duration], $lang_code) }}
<br><br>

@include('cms::emails.app.html.button', [
	'url' => $recovery_link,
	'text' => __('cms::emails/forgot-password.button', [], $lang_code)
])
@endsection
