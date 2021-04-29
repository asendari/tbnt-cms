{{-- THEME --}}
{{-- <meta name="theme-color" content="#000000" data-react-helmet="true" /> --}}

{{-- FAVICON --}}
{{-- <link rel="apple-touch-icon" sizes="180x180" href="{{ public_url('images/favicon/apple-touch-icon.png') }}"> --}}
{{-- <link rel="icon" type="image/png" sizes="32x32" href="{{ public_url('images/favicon/favicon-32x32.png') }}"> --}}
{{-- <link rel="icon" type="image/png" sizes="16x16" href="{{ public_url('images/favicon/favicon-16x16.png') }}"> --}}
{{-- <link rel="manifest" href="{{ public_url('images/favicon/site.webmanifest') }}"> --}}
{{-- <link rel="mask-icon" href="{{ public_url('images/favicon/safari-pinned-tab.svg') }}" color="#0070ba"> --}}
{{-- <meta name="msapplication-TileColor" content="#2d89ef"> --}}

{{-- META --}}
<title>{{ $title ?? __('cms::app.meta_title') }}{{ config('cms.meta_title_suffix') }}</title>
<meta name="description" content="{{ $description ?? __('cms::app.meta_description') }}" data-react-helmet="true" />

{{-- TWITTER --}}
{{-- <meta name="twitter:title" content="{{ $title ?? __('cms::app.meta_title') }}" data-react-helmet="true" /> --}}
{{-- <meta name="twitter:description" content="{{ $description ?? __('cms::app.meta_description') }}" data-react-helmet="true" /> --}}
{{-- <meta name="twitter:image:src" content="{{ public_url('images/share/twitter.jpg') }}" /> --}}
{{-- <meta name="twitter:card" content="summary_large_image" /> --}}

{{-- FACEBOOK --}}
{{-- <meta property="og:locale" content="{{ lang()->getCurrent()->locale }}" /> --}}
{{-- <meta property="og:title" content="{{ $title ?? __('cms::app.meta_title') }}" data-react-helmet="true" /> --}}
{{-- <meta property="og:description" content="{{ $description ?? __('cms::app.meta_description') }}" data-react-helmet="true" /> --}}
{{-- <meta property="og:image:width" content="880" /> --}}
{{-- <meta property="og:image:height" content="280" /> --}}
{{-- <meta property="og:image" itemprop="image" content="{{ public_url('images/share/facebook.jpg') }}" /> --}}
{{-- <meta property="og:type" content="website" /> --}}
{{-- <meta property="og:site_name" content="{{ app_name() }}" /> --}}

