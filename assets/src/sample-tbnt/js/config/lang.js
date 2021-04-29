'use strict';

import reduce from 'lodash/reduce';

import ObjectHelper from 'lib/js/helpers/object';

import LaravelConfig from './laravel';

import langs from '../langs';

const defaultTrans = langs[LaravelConfig.get('langs.default_code')] || {};

const LangConfig = new ObjectHelper({
    all: LaravelConfig.get('langs.all'),
    current: LaravelConfig.get('langs.current'),
    default_code: LaravelConfig.get('langs.default_code'),
    files: reduce(LaravelConfig.get('langs.all'), (res, lang) => ({ ...res, [lang.code]: langs[lang.code] || defaultTrans }), {}),
});

export default LangConfig;
