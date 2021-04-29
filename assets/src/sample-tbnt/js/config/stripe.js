'use strict';

import ObjectHelper from 'lib/js/helpers/object';

import LaravelConfig from './laravel';

const StripeConfig = new ObjectHelper({
    key: LaravelConfig.get('stripe.public_key'),
});

export default StripeConfig;
