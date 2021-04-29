'use strict';

import ObjectHelper from 'lib/js/helpers/object';

import AppConfig from './app';
import LangConfig from './lang';

const ServerConfig = new ObjectHelper({
    endpoint: AppConfig.get('url'),
    api: 'cms/web',
    timeout: 1000 * 60,
    options: {
        headers: {
            Accept: 'application/json',
            'X-App-Zone': 'app',
            'X-App-Lang': LangConfig.get('current.code'),
            'X-App-Platform': 'web',
        },
    },
});

export default ServerConfig;
