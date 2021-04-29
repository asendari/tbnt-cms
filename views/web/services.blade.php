@define (
	$google_analytics_id = config('services.google.analytics.id') ?? '';
	$google_tag_manager_id = config('services.google.tag_manager.id') ?? '';
	$facebook_pixel_id = config('services.facebook.pixel.id') ?? '';
)

{{-- Global site tag (gtag.js) - Google Analytics --}}
@if ($google_analytics_id)
<script async src="https://www.googletagmanager.com/gtag/js?id={{ $google_analytics_id }}"></script>
<script>
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());

	gtag('config', '{{ $google_analytics_id }}');
</script>
@endif

{{-- Google Tag Manager --}}
@if ($google_tag_manager_id)
<script>
	(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
	new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
	'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','{{ $google_tag_manager_id }}');
</script>
@endif

{{-- Facebook Pixel --}}
@if ($facebook_pixel_id)
<script>
	!function(f,b,e,v,n,t,s)
	{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
	n.callMethod.apply(n,arguments):n.queue.push(arguments)};
	if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
	n.queue=[];t=b.createElement(e);t.async=!0;
	t.src=v;s=b.getElementsByTagName(e)[0];
	s.parentNode.insertBefore(t,s)}(window, document,'script',
	'https://connect.facebook.net/en_US/fbevents.js');
	fbq('init', '{{ $facebook_pixel_id }}');
	fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id={{ $facebook_pixel_id }}&ev=PageView&noscript=1"
/></noscript>
@endif
