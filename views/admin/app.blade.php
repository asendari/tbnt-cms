<!DOCTYPE html>
<html lang="{{ lang()->getCurrentCode() }}">
<head>
	<base href="{{ app_url() }}/" />
	<meta charset="utf-8" />
	<meta http-equiv="Content-Language" content="{{ lang()->getCurrentCode() }}" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta name="HandheldFriendly" content="true" />
	<meta name="google" content="notranslate" />
	<meta name="csrf-token" content="{{ csrf_token() }}" />

	{{-- FAVICON --}}
	{{-- <link rel="apple-touch-icon" sizes="180x180" href="{{ public_url('images/favicon/apple-touch-icon.png') }}"> --}}
	{{-- <link rel="icon" type="image/png" sizes="32x32" href="{{ public_url('images/favicon/favicon-32x32.png') }}"> --}}
	{{-- <link rel="icon" type="image/png" sizes="16x16" href="{{ public_url('images/favicon/favicon-16x16.png') }}"> --}}
	{{-- <link rel="manifest" href="{{ public_url('images/favicon/site.webmanifest') }}"> --}}
	{{-- <link rel="mask-icon" href="{{ public_url('images/favicon/safari-pinned-tab.svg') }}" color="#0070ba"> --}}
	<meta name="msapplication-TileColor" content="#465161">
	<meta name="theme-color" content="#465161">

	{{-- META --}}
	<title>{{ $title ?? __('cms::app.meta_title') }}</title>
	<meta name="description" content="{{ $description ?? __('cms::app.meta_description') }}" />

	{{-- CANONICAL --}}
	@foreach ($canonical ?? [] as $lang_code => $link)
		<link rel="alternate" href="{{ make_url([app_url(), $link]) }}" hrefLang="{{ $lang_code }}" data-react-helmet="true" />
	@endforeach

	{{-- CSS --}}
	<link rel="stylesheet" href="{{ public_url('assets/admin/bundle.css') }}?_={{ file_time_safe(public_path('assets/admin/bundle.css')) }}" />
</head>
<body>
	<main id="cms">
		@yield('content')
	</main>

	@include('cms::compatibility.nojs')
	@include('cms::compatibility.browsehappy')

	@include('cms::admin.includes.splash')

	@include('cms::admin.js')

	<script src="{{ public_url('assets/admin/bundle.js') }}?_={{ file_time_safe(public_path('assets/admin/bundle.js')) }}"></script>
</body>
</html>
