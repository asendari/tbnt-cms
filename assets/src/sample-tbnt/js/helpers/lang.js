'use strict';

import LangHelperParent from 'lib/js/helpers/lang';

import get from 'lodash/get';
import map from 'lodash/map';

import DateFns from './datefns';

import LangConfig from '../config/lang';

class LangHelper extends LangHelperParent {
    routes = null;

    init(routes) {
        this.routes = routes;
    }

    get(key, args = [], defaultText = null) {
        let trans = get(this.currentLang, key, `[${key}]`);

        map(args, (replacment, key) => {
            trans = trans.replace(`:${key}`, replacment);
        });

        return trans;
    }

    getPlural(key, argCount, args = [], defaultText = null) {
        const trans = this.get(key, args, defaultText);
        const matches = trans?.match(/\[\[(.*)\|(.*)]\]/) ?? null;
        const matchArgCount = Number(args[argCount]);

        if (matches === null || matches.length < 3 || isNaN(matchArgCount) === true) return trans;

        return trans.replace(matches[0], matches[matchArgCount > 1 ? 2 : 1]);
    }

    formatDate(formatOut, date, formatIn) {
        if (date === undefined) return formatOut;

        date = DateFns(date, formatIn).format(formatOut);

        if (date.toLowerCase() === 'invalid date') return '';

        return date;
    }

    date(key, value, formatIn) {
        return this.formatDate(this.get(`modules.dates.js.${key}`), value, formatIn);
    }

    time(key, value, formatIn) {
        const time = value.split(':');
        const timeDate = DateFns();

        timeDate.setHours(time[0]);
        timeDate.setMinutes(time[1]);

        if (time[2]) timeDate.setSeconds(time[2]);

        return this.date(key, timeDate, formatIn);
    }

    router(key) {
        return this.routes.getPath(key);
    }
}

const Lang = new LangHelper({
    files: LangConfig.get('files'),
    languages: LangConfig.get('all'),
    device: LangConfig.get('current.code'),
    default: LangConfig.get('current.code'),
});

export default Lang;
