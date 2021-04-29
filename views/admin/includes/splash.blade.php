<style type="text/css">
	#cms-splash {
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		z-index: 9999;
	}

	#cms-splash .splash {
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;
		background: white;
	}

	#cms-splash .splash--content {
		width: 140px;
	}

	#cms-splash .splash--content svg,
	#cms-splash .splash--content img {
		width: 100%;
	}
</style>

<div id="cms-splash">
	<div class="splash">
		<div class="splash--content">
			<img src="{{ public_url(config('cms.logo')) }}" alt="" />
		</div>
	</div>
</div>
