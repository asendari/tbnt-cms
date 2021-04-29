'use strict';

import ObjectHelper from 'lib/js/helpers/object';

import keyBy from 'lodash/keyBy';
import keys from 'lodash/keys';
import pick from 'lodash/pick';

import LaravelConfig from './laravel';

import fr from '../langs/fr';
import en from '../langs/en';

const files = { fr, en };

const LangConfig = new ObjectHelper({
    all: keyBy(LaravelConfig.get('langs.all'), 'code'),
    current: LaravelConfig.get('langs.current'),
    default_code: LaravelConfig.get('langs.default_code'),
    files,
});

export default LangConfig;
