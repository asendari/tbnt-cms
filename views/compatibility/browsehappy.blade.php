<script>
	if (((!!window.ActiveXObject && +(/msie\s(\d+)/i.exec( navigator.userAgent )[1])) || null) !== null || (/*@cc_on!@*/false) === true) {
		document.write(
			'<style>' +
				'html { background: white !important; }' +
				'body { background: white !important; }' +
				'#cms { display: none !important; visiblity: hidden !important; opacity: 0 !important; pointer-events: none !important; }' +
				'#cms * { display: none !important; visiblity: hidden !important; opacity: 0 !important; pointer-events: none !important; }' +
				'.browsehappy { position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; padding: 48px; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -ms-flex-direction: column; flex-direction: column; -webkit-box-pack: center; -ms-flex-pack: center; justify-content: center; -webkit-box-align: center; -ms-flex-align: center; align-items: center; }' +
				'.browsehappy img { width: 40%; height: auto; margin: auto; }' +
				'.browsehappy p { text-align: center; margin-bottom: 48px; color: black; }' +
				'.browsehappy p a { color: black; text-decoration: underline; }' +
			'</style>' +
			'<div class="browsehappy">' +
				'<p style="margin-bottom: 48px;">' +
					'<img src="{{ public_url(config('cms.logo')) }}" alt="" />' +
				'</p>' +
				'<p>' +
					'Your browser is way too old brother!<br />' +
					'<a href="https://browsehappy.com" rel="noopener">Upgrade to a different browser</a> to experience this site.' +
				'</p>' +
			'</div>'
		);
	}
</script>
