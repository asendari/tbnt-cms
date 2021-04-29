'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import dangerousHtml from 'lib/js/utils/dangerousHtml';
import toClassName from 'lib/js/utils/toClassName';

import Lang from '../../helpers/lang';

const mailchimpDomain = 'xxxxxx.us15.list-manage.com';
const mailchimpAccountId = 'xxxxxxxxxxxxxxxxxxxxxxxxx';

const mailchimpIds = {
    fr: 'xxxxxxxxxx',
    en: 'xxxxxxxxxx',
};

const MailchimpLayoutComponent = (props) => {
    const { placeholder, ...rest } = props;

    const mailchimpId = mailchimpIds[Lang.getLangCode()] ?? null;
    const mailchimpName = `b_${mailchimpAccountId}_${mailchimpId}`;
    const mailchimpUrl = `https://${mailchimpDomain}/subscribe/post?u=${mailchimpAccountId}&amp;id=${mailchimpId}`;

    if (mailchimpId === null) return null;

    return (
        <div
            {...rest}
            className={toClassName(['mailchimp', rest.className])}
            {...dangerousHtml(`
				<div id="mc_embed_signup">
					<form action="${mailchimpUrl}" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" rel="external" novalidate>
						<div id="mc_embed_signup_scroll">
							<div class="mc-field-group">
								<div class="input input-type-email">
									<div class="input--input">
										<input type="email" value="" name="EMAIL" class="required email input-value" id="mce-EMAIL" placeholder="${placeholder}">
									</div>
								</div>
							</div>
							<div class="button-container clear">
								<input type="submit" value="Subscribe" name="subscribe">
								<svg width="64" height="9" viewBox="0 0 64 9" xmlns="http://www.w3.org/2000/svg">
									<path fill="#3a3a3a" fillRule="evenodd" d="M62.3,4.95 L0.5,4.95 C0.2,4.95 -7.81597009e-14,4.75 -7.81597009e-14,4.45 C-7.81597009e-14,4.15 0.2,3.95 0.5,3.95 L62.2,3.95 L59.1,0.85 C58.9,0.65 58.9,0.35 59.1,0.15 C59.3,-0.05 59.6,-0.05 59.8,0.15 L63.1,3.45 C63.7,4.05 63.7,4.95 63.1,5.55 L59.8,8.85 C59.8,8.95 59.7,8.95 59.5,8.95 C59.4,8.95 59.2,8.95 59.1,8.85 C58.9,8.65 58.9,8.35 59.1,8.15 L62.3,4.95 Z"/>
								</svg>
							</div>
						</div>
						<div id="mce-responses" class="clear">
							<div class="response" id="mce-error-response" style="display:none"></div>
							<div class="response" id="mce-success-response" style="display:none"></div>
						</div>
						<div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="${mailchimpName}" tabindex="-1" value=""></div>
					</form>
				</div>
				<script type='text/javascript' src='//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js'></script><script type='text/javascript'>(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';fnames[3]='ADDRESS';ftypes[3]='address';fnames[4]='PHONE';ftypes[4]='phone';}(jQuery));var $mcj = jQuery.noConflict(true);</script>
			`)}
        />
    );
};

MailchimpLayoutComponent.propTypes = {
    placeholder: PropTypes.string,
};

MailchimpLayoutComponent.defaultProps = {
    placeholder: '',
};

export default React.memo(MailchimpLayoutComponent);
