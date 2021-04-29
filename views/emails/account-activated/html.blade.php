@extends('cms::emails.app.html', [
	'subject' => __('cms::emails/account-activated.subject', ['name' => app_name()], $lang_code),
])

@section('content')
{{ __('cms::emails/account-activated.title', [], $lang_code) }}
<br><br>

{{ __('cms::emails/account-activated.message', [], $lang_code) }}
{{ __('cms::emails/account-activated.duration', ['duration' => $duration], $lang_code) }}
<br><br>

@include('cms::emails.app.html.button', [
	'url' => $recovery_link,
	'text' => __('cms::emails/account-activated.button', [], $lang_code)
])
@endsection
