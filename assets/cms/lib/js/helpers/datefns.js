'use strict';

/**
 * @name DateFnsHelperLib
 * @description Date helper for ReactJS personal library
 * @file ReactJS Date helper
 *
 * @version 1.3.0 - 2020-03-26
 * @author Alexandre Pilloud
 */

import head from 'lodash/head';
import keys from 'lodash/keys';
import size from 'lodash/size';

import addDays from 'date-fns/addDays';
import addHours from 'date-fns/addHours';
import addMinutes from 'date-fns/addMinutes';
import addMonths from 'date-fns/addMonths';
import addSeconds from 'date-fns/addSeconds';
import addWeeks from 'date-fns/addWeeks';
import addYears from 'date-fns/addYears';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import differenceInCalendarISOWeeks from 'date-fns/differenceInCalendarISOWeeks';
import differenceInCalendarISOWeekYears from 'date-fns/differenceInCalendarISOWeekYears';
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths';
import differenceInCalendarQuarters from 'date-fns/differenceInCalendarQuarters';
import differenceInCalendarWeeks from 'date-fns/differenceInCalendarWeeks';
import differenceInCalendarYears from 'date-fns/differenceInCalendarYears';
import differenceInDays from 'date-fns/differenceInDays';
import differenceInHours from 'date-fns/differenceInHours';
import differenceInISOWeekYears from 'date-fns/differenceInISOWeekYears';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import differenceInMonths from 'date-fns/differenceInMonths';
import differenceInQuarters from 'date-fns/differenceInQuarters';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import differenceInWeeks from 'date-fns/differenceInWeeks';
import differenceInYears from 'date-fns/differenceInYears';
import endOfISOWeek from 'date-fns/endOfISOWeek';
import format from 'date-fns/format';
import getISODay from 'date-fns/getISODay';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isToday from 'date-fns/isToday';
import isValid from 'date-fns/isValid';
import parseISO from 'date-fns/parseISO';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import setSeconds from 'date-fns/setSeconds';
import subDays from 'date-fns/subDays';
import subHours from 'date-fns/subHours';
import subMinutes from 'date-fns/subMinutes';
import subMonths from 'date-fns/subMonths';
import subSeconds from 'date-fns/subSeconds';
import subWeeks from 'date-fns/subWeeks';
import subYears from 'date-fns/subYears';

import en from 'date-fns/locale/en-US';

class DateFnsHelperLib {
    #date = null;
    #locales = defaultLocales;
    #locale = defaultLocale;

    constructor(date) {
        if (date === undefined) date = new Date();
        if (date instanceof DateFnsHelperLib) date = date.toDate();
        if (date instanceof Date) date = date.toISOString();

        this.#date = parseISO(date);
    }

    clone() {
        return new this.constructor(new Date(this.#date.getTime()));
    }

    toDate() {
        return this.#date;
    }

    getDate(date) {
        return date ? ('toDate' in date ? date.toDate() : date) : new Date();
    }

    format(output) {
        return format(this.#date, output, { locale: this.#locales[this.#getLocale()] });
    }

    isAfter(date) {
        return isAfter(this.#date, this.getDate(date));
    }

    isBefore(date) {
        return isBefore(this.#date, this.getDate(date));
    }

    isToday() {
        return isToday(this.#date);
    }

    isValid() {
        return isValid(this.#date);
    }

    setHours(hours) {
        return this.executeReturnSelf(() => {
            this.#date = setHours(this.#date, hours);
        });
    }

    setMinutes(minutes) {
        return this.executeReturnSelf(() => {
            this.#date = setMinutes(this.#date, minutes);
        });
    }

    setSeconds(seconds) {
        return this.executeReturnSelf(() => {
            this.#date = setSeconds(this.#date, seconds);
        });
    }

    addYears(years) {
        return this.executeReturnSelf(() => {
            this.#date = addYears(this.#date, years);
        });
    }

    addMonths(months) {
        return this.executeReturnSelf(() => {
            this.#date = addMonths(this.#date, months);
        });
    }

    addWeeks(weeks) {
        return this.executeReturnSelf(() => {
            this.#date = addWeeks(this.#date, weeks);
        });
    }

    addDays(days) {
        return this.executeReturnSelf(() => {
            this.#date = addDays(this.#date, days);
        });
    }

    addHours(hours) {
        return this.executeReturnSelf(() => {
            this.#date = addHours(this.#date, hours);
        });
    }

    addMinutes(minutes) {
        return this.executeReturnSelf(() => {
            this.#date = addMinutes(this.#date, minutes);
        });
    }

    addSeconds(seconds) {
        return this.executeReturnSelf(() => {
            this.#date = addSeconds(this.#date, seconds);
        });
    }

    subYears(years) {
        return this.executeReturnSelf(() => {
            this.#date = subYears(this.#date, years);
        });
    }

    subMonths(months) {
        return this.executeReturnSelf(() => {
            this.#date = subMonths(this.#date, months);
        });
    }

    subWeeks(weeks) {
        return this.executeReturnSelf(() => {
            this.#date = subWeeks(this.#date, weeks);
        });
    }

    subDays(days) {
        return this.executeReturnSelf(() => {
            this.#date = subDays(this.#date, days);
        });
    }

    subHours(hours) {
        return this.executeReturnSelf(() => {
            this.#date = subHours(this.#date, hours);
        });
    }

    subMinutes(minutes) {
        return this.executeReturnSelf(() => {
            this.#date = subMinutes(this.#date, minutes);
        });
    }

    subSeconds(seconds) {
        return this.executeReturnSelf(() => {
            this.#date = subSeconds(this.#date, seconds);
        });
    }

    diff(date, output, options = {}) {
        if (
            [
                'year',
                'years',
                'quarter',
                'quarters',
                'month',
                'months',
                'week',
                'weeks',
                'day',
                'days',
                'hour',
                'hours',
                'minute',
                'minutes',
                'second',
                'seconds',
            ].indexOf(date) !== -1
        ) {
            options = output ?? {};
            output = date;
            date = new Date();
        }

        date = this.getDate(date);

        if (['year', 'years'].indexOf(output) !== -1) {
            return options.calendar === true && options.iso === true
                ? differenceInCalendarISOWeekYears(this.#date, date)
                : options.calendar === true
                ? differenceInCalendarYears(this.#date, date)
                : options.iso === true
                ? differenceInISOWeekYears(this.#date, date)
                : differenceInYears(this.#date, date);
        } else if (['quarter', 'quarters'].indexOf(output) !== -1) {
            return options.calendar === true
                ? differenceInCalendarQuarters(this.#date, date)
                : differenceInQuarters(this.#date, date);
        } else if (['month', 'months'].indexOf(output) !== -1) {
            return options.calendar === true
                ? differenceInCalendarMonths(this.#date, date)
                : differenceInMonths(this.#date, date);
        } else if (['week', 'weeks'].indexOf(output) !== -1) {
            return options.calendar === true && options.iso === true
                ? differenceInCalendarISOWeeks(this.#date, date)
                : options.calendar === true
                ? differenceInCalendarWeeks(this.#date, date)
                : options.iso === true
                ? differenceInCalendarISOWeeks(this.#date, date)
                : differenceInWeeks(this.#date, date);
        } else if (['day', 'days'].indexOf(output) !== -1) {
            return options.calendar === true && options.iso === true
                ? differenceInCalendarDays(this.#date, date)
                : differenceInDays(this.#date, date);
        } else if (['hour', 'hours'].indexOf(output) !== -1) {
            return differenceInHours(this.#date, date);
        } else if (['minute', 'minutes'].indexOf(output) !== -1) {
            return differenceInMinutes(this.#date, date);
        } else if (['second', 'seconds'].indexOf(output) !== -1) {
            return differenceInSeconds(this.#date, date);
        } else {
            return differenceInMilliseconds(this.#date, date);
        }
    }

    getISODay() {
        return getISODay(this.#date);
    }

    endOfISOWeek() {
        return this.executeReturnCloned(() => endOfISOWeek(this.#date));
    }

    locale(code) {
        this.#locale = code;
    }

    #getLocale = () => {
        return this.#locale ?? defaultLocale;
    };

    localeExists(locale) {
        return this.#locales[locale] !== undefined;
    }

    setCurrentLocales(newLocales) {
        if (size(newLocales) === 0) return;

        this.#locales = newLocales;

        if (this.localeExists(this.#locale) === false) this.setCurrentLocale(firstKey(this.#locales));
    }

    setCurrentLocale(newLocale) {
        if (this.localeExists(newLocale) === true) this.#locale = newLocale;
    }

    static defaultLocaleExists(locale) {
        return defaultLocales[locale] !== undefined;
    }

    static setLocales(newLocales) {
        if (size(newLocales) === 0) return;

        defaultLocales = newLocales;

        if (DateFnsHelperLib.defaultLocaleExists(defaultLocale) === false)
            DateFnsHelperLib.setDefaultLocale(firstKey(defaultLocales));
    }

    static setDefaultLocale(newLocale) {
        if (DateFnsHelperLib.defaultLocaleExists(newLocale) === true) defaultLocale = newLocale;
    }

    executeReturnCloned(cb) {
        return new this.constructor(new Date(cb().getTime()));
    }

    executeReturnSelf(cb) {
        return this.executeReturn(cb, this);
    }

    executeReturn(cb, returnValue) {
        cb();
        return returnValue;
    }
}

const firstKey = (locales) => head(keys(locales));

let defaultLocales = { en };
let defaultLocale = firstKey(defaultLocales);

export const datefns = (date) => new DateFnsHelperLib(date);

export default DateFnsHelperLib;
