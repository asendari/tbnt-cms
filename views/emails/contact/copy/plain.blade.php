@extends('cms::emails.app.plain')

@section('content')
{{ __('cms::emails/contact/copy.title') }}

{{ __('cms::emails/contact/copy.message') }}
@endsection
