'use strict';

import ObjectHelper from 'lib/js/helpers/object';

import DeviceConfig from './device';

const StorageConfig = new ObjectHelper({
    parameters: {
        theme: DeviceConfig.get('isDarkMode') === true ? 'dark' : 'day',
        cookies: false,
    },
    cart: {},
});

export default StorageConfig;
