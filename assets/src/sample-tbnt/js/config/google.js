'use strict';

import ObjectHelper from 'lib/js/helpers/object';

import LaravelConfig from './laravel';

const GoogleConfig = new ObjectHelper({
    api: {
        key: LaravelConfig.get('google.api_key'),
    },
    recaptcha: {
        key: LaravelConfig.get('google.recaptcha_key'),
    },
    analytics: {
        id: LaravelConfig.get('google.analytics_id'),
    },
});

export default GoogleConfig;
