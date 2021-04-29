<script>
	window.Laravel = @define(
		echo json_encode([
			'app' => [
				'base' => base_url(),
				'name' => app_name(),
				'url' => app_url(),
                'types' => config('cmstypes'),
				'admin_base' => config('cms.admin_base'),
				'sidebar_default' => config('cms.sidebar_default'),
				'functions' => [
					'contact' => config('cms.contact'),
					'user' => config('cms.user'),
				],
			],
			'langs' => [
				'all' => lang()->all(),
				'current' => lang()->getCurrent(),
				'default_code' => lang()->getDefaultCode(),
			],
		]);
	);
</script>
