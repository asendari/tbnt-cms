<!DOCTYPE html>

@define (
	$google_tag_manager_id = config('services.google.tag_manager.id') ?? '';
)

<html lang="{{ lang()->getCurrentCode() }}">
<head>
	<base href="{{ app_url() }}/" />
	<meta charset="utf-8" />
	<meta http-equiv="Content-Language" content="{{ lang()->getCurrentCode() }}" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
	<meta name="HandheldFriendly" content="true" />
	<meta name="google" content="notranslate" />
	<meta name="csrf-token" content="{{ csrf_token() }}" />

	@if (isset($is_indexable) === true && $is_indexable === false)
		<meta name="robots" content="noindex,nofollow">
	@endif

	@foreach ($canonical ?? [] as $lang_code => $link)
		<link rel="alternate" href="{{ make_url([app_url(), $link]) }}" hrefLang="{{ $lang_code }}" data-react-helmet="true" />
	@endforeach

	@include('cms::web.includes.head')
	@include('cms::web.services')

	<link rel="stylesheet" href="{{ public_url('assets/web/bundle.css') }}?_={{ file_time_safe(public_path('assets/web/bundle.css')) }}" />
</head>
<body>
	@if ($google_tag_manager_id)
	<noscript>
		<iframe src="https://www.googletagmanager.com/ns.html?id={{ $google_tag_manager_id }}" height="0" width="0" style="display:none;visibility:hidden"></iframe>
	</noscript>
	@endif

	<main id="cms">
		@yield('content')
	</main>

	@include('cms::compatibility.nojs')
	@include('cms::compatibility.browsehappy')

	@include('cms::web.includes.splash')

	@include('cms::web.js')

	<script src="{{ public_url('assets/web/bundle.js') }}?_={{ file_time_safe(public_path('assets/web/bundle.js')) }}"></script>
</body>
</html>
