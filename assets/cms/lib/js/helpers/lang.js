'use strict';

/**
 * @name LangHelperLib
 * @description Lang helper for ReactJS personal library
 * @file ReactJS Lang helper
 *
 * @version 1.1.1 - 2020-02-06
 * @author Alexandre Pilloud
 */

import filter from 'lodash/filter';
import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import keys from 'lodash/keys';
import map from 'lodash/map';
import merge from 'lodash/merge';
import pick from 'lodash/pick';

import call from 'lib/js/utils/call';

class LangHelperLib {
    constructor(config) {
        this.files = get(config, 'files', {});
        this.langs = pick(keyBy(get(config, 'languages', {}), 'code'), keys(this.files));

        this.deviceLang = get(config, 'device', 'en');
        this.defaultLang = get(config, 'default', 'en');
        this.defaultText = get(config, 'not_found', '...');

        this.languages = {};
        this.currentLang = {};
        this.currentLangCode = '';

        this.updateLanguages();
        this.update(this.deviceLang);
    }

    exists(langCode) {
        return this.languages[langCode] !== undefined;
    }

    get(key, ...args) {
        return call(
            get(this.currentLang, key, () => call(this.defaultText, key)),
            ...args,
        );
    }

    getFor(langCode, key, ...args) {
        return call(
            get(this.languages, `${langCode}.file.${key}`, () => call(this.defaultText, key)),
            ...args,
        );
    }

    getKey(value, path = '') {
        return filter(
            map(get(this.currentLang, path), (text, key) => {
                if (text === value) return key;
            }),
        )[0];
    }

    getKeyFor(langCode, value, path = '') {
        return filter(
            map(get(this.languages, `${langCode}.file.${path}`), (text, key) => {
                if (text === value) return key;
            }),
        )[0];
    }

    getLang(langCode) {
        return this.languages[langCode || this.currentLangCode];
    }

    getLangCode() {
        return this.currentLangCode;
    }

    getLangs() {
        return this.languages;
    }

    getLangsCodes() {
        return keys(this.languages);
    }

    validate(langCode) {
        if (this.exists(langCode) === false) langCode = this.deviceLang;
        if (this.exists(langCode) === false) langCode = this.defaultLang;

        return langCode;
    }

    update(langCode) {
        this.currentLangCode = this.validate(langCode);
        this.currentLang = merge({}, this.languages[this.defaultLang]?.file, this.languages[this.currentLangCode]?.file);
    }

    updateFile(langFile, langCode) {
        langCode = langCode || this.currentLangCode;

        this.files[langCode] = langFile;
        this.langs[langCode] = this.langs[langCode] || {};

        this.updateLanguages();
        this.update(langCode);
    }

    updateLanguages() {
        this.languages = keyBy(
            map(this.langs, (lang) => merge({ file: this.files[lang.code] || {} }, { file: lang.file || {} }, lang)),
            'code',
        );
    }
}

export default LangHelperLib;
