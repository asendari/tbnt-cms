'use strict';

import ObjectHelper from 'lib/js/helpers/object';

import trimEnd from 'lodash/trimEnd';

import toSlug from 'lib/js/utils/toSlug';

import LaravelConfig from './laravel';

const suffix = '';
const isDev = process.env.NODE_ENV === 'development';

const AppConfig = new ObjectHelper({
    base: `${trimEnd(LaravelConfig.get('app.base'), '/')}/${suffix}`,
    dev: isDev,
    initialLoaderTimeout: 1000 * (isDev === true ? 0 : 1),
    name: LaravelConfig.get('app.name'),
    name_slug: toSlug(LaravelConfig.get('app.name')),
    suffix,
    types: LaravelConfig.get('app.types'),
    url: `${trimEnd(LaravelConfig.get('app.url'), '/')}/${suffix}`,
});

export default AppConfig;
