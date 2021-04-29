@extends('cms::emails.app.html', [
	'subject' => __('cms::emails/contact/contact.subject', ['name' => app_name()]),
])

@section('content')
{{ __('cms::emails/contact/contact.title') }}
<br><br>

{{ __('cms::emails/contact/contact.message') }}
@endsection
