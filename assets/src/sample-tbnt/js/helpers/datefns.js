'use strict';

import en from 'date-fns/locale/en-US';
import fr from 'date-fns/locale/fr';

import DateHelper from 'lib/js/helpers/datefns';

import LangConfig from '../config/lang';

DateHelper.setLocales({ en, fr });
DateHelper.setDefaultLocale(LangConfig.get('current.code'));

const datefns = (date) => new DateHelper(date);

export default datefns;
