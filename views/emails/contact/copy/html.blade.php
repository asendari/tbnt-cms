@extends('cms::emails.app.html', [
	'subject' => __('cms::emails/contact/copy.subject', ['name' => app_name()]),
])

@section('content')
{{ __('cms::emails/contact/copy.title') }}
<br><br>

{{ __('cms::emails/contact/copy.message') }}
@endsection
