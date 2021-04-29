<?php echo '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
@foreach ($data as $data_row)
<url>
	<loc>{{ $data_row['loc'] }}</loc>
@foreach ($data_row['xhtml:link'] as $lang_code => $xhtml_link)
	<xhtml:link rel="alternate" hreflang="{{ $lang_code }}" href="{{ $xhtml_link }}" />
@endforeach
	<lastmod>{{ $data_row['lastmod'] }}</lastmod>
</url>
@endforeach
</urlset>
