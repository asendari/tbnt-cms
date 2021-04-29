'use strict';

import LangHelperParent from 'lib/js/helpers/lang';

import makeUrl from 'lib/js/utils/makeUrl';

import DateFns from './datefns';

import AppConfig from '../config/app';
import LangConfig from '../config/lang';

class LangHelper extends LangHelperParent {
    formatDate(formatOut, datetime, formatIn, today = false) {
        if ((datetime ?? null) === null) return '';

        datetime = DateFns(datetime, formatIn);

        const date = datetime.format('yyyy-MM-dd');

        if (date.toLowerCase() === 'invalid date') {
            return '';
        } else if (today === true) {
            const now = DateFns();

            if (now.clone().format('yyyy-MM-dd') === date) {
                return this.get('dates.today', this.get('dates.to', datetime.format('HH:mm')));
            } else if (now.clone().addDays(1).format('yyyy-MM-dd') === date) {
                return this.get('dates.tomorrow', this.get('dates.to', datetime.format('HH:mm')));
            } else if (now.clone().subDays(1).format('yyyy-MM-dd') === date) {
                return this.get('dates.yesterday', this.get('dates.to', datetime.format('HH:mm')));
            } else {
                return this.get('dates.the', datetime.format(formatOut));
            }
        } else {
            return datetime.format(formatOut);
        }
    }

    date(format, datetime, formatIn) {
        return this.formatDate(this.get(`dates.${format}`), datetime, formatIn);
    }

    dateToday(format, datetime, formatIn) {
        return this.formatDate(this.get(`dates.${format}`), datetime, formatIn, true);
    }

    pluralize(value) {
        return String(value)
            .split(' ')
            .map((v) => this.get('plural.many', v))
            .join(' ');
    }

    router(route) {
        return makeUrl([AppConfig.get('admin_base'), this.get(`router.${route}`)], true);
    }
}

const Lang = new LangHelper({
    files: LangConfig.get('files'),
    languages: LangConfig.get('all'),
    device: LangConfig.get('current.code'),
    default: 'fr',
    not_found: (key) => `[${key}]`,
});

export default Lang;
