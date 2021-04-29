@extends('cms::emails.app.plain')

@section('content')
{{ __('cms::emails/contact/contact.title') }}

{{ __('cms::emails/contact/contact.message') }}
@endsection
