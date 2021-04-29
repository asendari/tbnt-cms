<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="utf-8"> <!-- utf-8 works for most cases -->
	<meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
	<meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
	<title>{{ $subject ?: __('cms::emails/defaults.subject', [], $lang_code ?? '') }}</title>

	<!-- Font -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:400">

	<!-- CSS Reset -->
	<style>
	/* What it does: Remove spaces around the email design added by some email clients. */
	/* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
	html,
	body {
		margin: 0 auto !important;
		padding: 0 !important;
		height: 100% !important;
		width: 100% !important;
	}

	/* What it does: Stops email clients resizing small text. */
	* {
		-ms-text-size-adjust: 100%;
		-webkit-text-size-adjust: 100%;
	}

	/* What is does: Centers email on Android 4.4 */
	div[style*="margin: 16px 0"] {
		margin:0 !important;
	}

	/* What it does: Stops Outlook from adding extra spacing to tables. */
	table,
	td {
		mso-table-lspace: 0pt !important;
		mso-table-rspace: 0pt !important;
	}

	/* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */
	table {
		border-spacing: 0 !important;
		border-collapse: collapse !important;
		table-layout: fixed !important;
		margin: 0 auto !important;
	}
	table table table {
		table-layout: auto;
	}

	/* What it does: Uses a better rendering method when resizing images in IE. */
	img {
		-ms-interpolation-mode:bicubic;
	}

	/* What it does: A work-around for iOS meddling in triggered links. */
	*[x-apple-data-detectors] {
		color: inherit !important;
		text-decoration: none !important;
	}

	/* What it does: A work-around for Gmail meddling in triggered links. */
	.x-gmail-data-detectors,
	.x-gmail-data-detectors *,
	.aBn {
		border-bottom: 0 !important;
		cursor: default !important;
	}

	/* What it does: Prevents Gmail from displaying an download button on large, non-linked images. */
	.a6S {
		display: none !important;
		opacity: .001 !important;
	}
	/* If the above doesn't work, add a .g-img class to any image in question. */
	img.g-img + div {
		display:none !important;
	}

	/* What it does: Prevents underlining the button text in Windows 10 */
	.button-link {
		text-decoration: none !important;
	}

	/* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
	/* Create one of these media queries for each additional viewport size you'd like to fix */
	/* Thanks to Eric Lepetit @ericlepetitsf) for help troubleshooting */
	@media only screen and (min-device-width: 375px) and (max-device-width: 413px) { /* iPhone 6 and 6+ */
		.email-container {
			min-width: 375px !important;
		}
	}

	</style>

	<!-- Progressive Enhancements -->
	<style>

	/* What it does: Hover styles for buttons */
	.button-td,
	.button-a {
		transition: all 100ms ease-in;
	}
	.button-td:hover,
	.button-a:hover {
		background: #1e87f0 !important;
		border-color: #1e87f0 !important;
		opacity: .9!important;
	}

	/* What it does: Link color */
	a, a:visited, a:hover, a:active, a:focus {
		color: #1e87f0 !important;
	}

	</style>

	<!-- Outlook fallback font -->
	<!--[if mso]>
	<style type=”text/css”>

	.fallback-text {
		font-family: Arial, sans-serif;
	}

	</style>
	<![endif]-->
</head>
<body width="100%" bgcolor="#f5f5f5" style="margin: 0; mso-line-height-rule: exactly;">
	<center style="width: 100%; background: #f5f5f5; text-align: left;">

		<!-- Visually Hidden Preheader Text : BEGIN -->
		<div class="fallback-text" style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: 'Poppins', sans-serif;">
			{{ $subject ?: __('cms::emails/defaults.subject', [], $lang_code ?? '') }}
		</div>
		<!-- Visually Hidden Preheader Text : END -->

		<!--
		Set the email width. Defined in two places:
		1. max-width for all clients except Desktop Windows Outlook, allowing the email to squish on narrow but never go wider than 600px.
		2. MSO tags for Desktop Windows Outlook enforce a 600px width.
	-->
	<div style="max-width: 600px; margin: 0 auto;" class="email-container">
		<!--[if mso]>
		<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center">
		<tr>
		<td>
		<![endif]-->

		<!-- Clear Spacer : BEGIN -->
		<tr>
			<td height="40" style="font-size: 0; line-height: 0;">
				&nbsp;
			</td>
		</tr>
		<!-- Clear Spacer : END -->

		<!-- Email Content : BEGIN -->
		<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="box-shadow: 0px 8px 16px rgba(25, 25, 25, .1);">
			<tr>
				<td>
					<!-- Email Header : BEGIN -->
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
						<tr>
							<td bgcolor="#ffffff" style="padding: 20px 0; padding-top: 40px; text-align: center">
								<img class="fallback-text" src="{{ public_url(config('cms.logo')) }}" width="150" alt="{{ app_name() }}" border="0" style="height: auto; max-width: 100%; font-family: 'Poppins', sans-serif; font-size: 22px; line-height: 24px; color: #191919;">
							</td>
						</tr>
					</table>
					<!-- Email Header : END -->

					<!-- Email Body : BEGIN -->
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">

						<!-- Column Text + Button : BEGIN -->
						<tr>
							<td bgcolor="#ffffff">
								<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
									<tr>
										<td class="fallback-text" style="padding: 40px; font-family: 'Poppins', sans-serif; font-size: 15px; line-height: 20px; color: #191919;">
											@yield('content')

											<br><br>

											{{ __('cms::emails/defaults.end_message', ['name' => app_name()], $lang_code ?? '') }}
										</td>
									</tr>
								</table>
							</td>
						</tr>
						<!-- Column Text + Button : END -->

					</table>
					<!-- Email Body : END -->
				</td>
			</tr>
		</table>
		<!-- Email Content : END -->

		<!-- Email Footer : BEGIN -->
		<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;">
			<tr>
				<td class="fallback-text" style="padding: 10px 10px 30px;width: 100%;font-size: 12px; font-family: 'Poppins', sans-serif; line-height:18px; text-align: center; color: #888888;" class="x-gmail-data-detectors">
					<br><br>
					{{ __('cms::emails/defaults.copyright', [], $lang_code ?? '') }}
					<br><br>
				</td>
			</tr>
		</table>
		<!-- Email Footer : END -->

		<!--[if mso]>
	</td>
</tr>
</table>
<![endif]-->
</div>
</center>
</body>
</html>
