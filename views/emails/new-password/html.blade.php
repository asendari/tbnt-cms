@extends('cms::emails.app.html', [
	'subject' => __('cms::emails/new-password.subject', ['name' => app_name()], $lang_code),
])

@section('content')
{{ __('cms::emails/new-password.title', [], $lang_code) }}
<br><br>

{{ __('cms::emails/new-password.message', [], $lang_code) }}
<br><br>

{{ __('cms::emails/new-password.password', [], $lang_code) }}
<br>
{{ $password }}
<br><br>

@include('cms::emails.app.html.button', [
	'url' => $signin_link,
	'text' => __('cms::emails/new-password.button', [], $lang_code)
])
@endsection
