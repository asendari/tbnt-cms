<script>
	window.Laravel = @define(
		echo json_encode([
			'app' => [
				'base' => base_url(),
				'name' => app_name(),
				'url' => app_url(),
                'types' => config('cmstypes'),
			],
			'langs' => [
				'all' => lang()->allWithoutHidden(),
				'current' => lang()->getCurrent(),
				'default_code' => lang()->getDefaultCode(),
			],
			'google' => [
				'api_key' => config('services.google.api.key'),
				'recaptcha_key' => config('services.google.recaptcha.key'),
				'analytics_id' => config('services.google.analytics.id'),
				'tag_manager_id' => config('services.google.tag_manager.id'),
			],
			'facebook' => [
				'pixel_id' => config('services.facebook.pixel.id'),
			],
			'stripe' => [
				'public_key' => config('services.stripe.key'),
			],
		]);
	);
</script>
