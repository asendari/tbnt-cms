'use strict';

/**
 * @name ServerHelperLib
 * @description Server helper for ReactJS personal library
 * @file ReactJS Server helper
 *
 * @version 1.1.2 - 2019-12-18
 * @author Alexandre Pilloud
 */

import axios from 'axios';

import isPlainObject from 'lodash/isPlainObject';
import keys from 'lodash/keys';
import map from 'lodash/map';
import merge from 'lodash/merge';
import size from 'lodash/size';
import trim from 'lodash/trim';
import values from 'lodash/values';

import call from 'lib/js/utils/call';
import isArray from 'lib/js/utils/isArray';
import isFunc from 'lib/js/utils/isFunc';
import isObject from 'lib/js/utils/isObject';
import nextTick from 'lib/js/utils/nextTick';
import toArray from 'lib/js/utils/toArray';

const contentTypes = {
    data: 'multipart/form-data',
    json: 'application/json; charset=UTF-8',
};

class ServerHelperLib {
    constructor(config) {
        this.endpointApi = '';
        this.sources = [];
        this.options = config.options;
        this.config = config;

        this.setEndpoint(config.endpoint);
        this.setApi(config.api);

        this.axios = axios.create({
            timeout: config.timeout,
        });
    }

    setEndpoint(url = '') {
        this.endpoint = this.trimUrl(url);
        this.endpointApi = `${this.endpoint}/${this.api}`;
    }

    setApi(api = '') {
        this.api = this.trimUrl(api);
        this.endpointApi = `${this.endpoint}/${this.api}`;
    }

    setAuthorization(token = null) {
        if (token === null) delete this.axios.defaults.headers.common['Authorization'];
        else this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    trimUrl(url = '') {
        return trim(url, '/');
    }

    formatUrl(url = '', endpoint) {
        return this.trimUrl(`${this.trimUrl(endpoint || this.endpoint)}/${this.trimUrl(url)}`);
    }

    updateOptions(callback) {
        if (isFunc(callback) === true) {
            this.options = callback(this.options);
        } else if (isObject(callback) === true) {
            this.options = callback;
        }
    }

    prepareOptions(options = {}) {
        return merge(
            {
                data: null,
                headers: {
                    'Content-Type': contentTypes[options.type || 'json'],
                    'X-Csrf-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
            },
            this.options,
            options,
            {
                baseURL: `${this.formatUrl('', `${options.baseURL || this.endpoint}/${options.api || this.api}`)}/`,
                transformRequest: [
                    (data, header) => {
                        if (options.type !== 'data') return JSON.stringify(data);

                        return this.formatData(new FormData(), data);
                    },
                ],
            },
        );
    }

    formatData(formData, data, prefix = '') {
        const mustArraize = prefix.indexOf('[]') === prefix.length - 2;
        prefix = mustArraize === true ? prefix.slice(0, -2) : prefix;

        if ((isPlainObject(data) === true || isArray(data) === true) && size(data) === 0) formData.append(prefix, '');

        for (let i = 0, k = keys(data), c = k.length; i < c; i++) {
            const key = k[i];
            const value = data[key];
            const prefixKey = `${prefix}${mustArraize === true ? `[${key}]` : key}`;

            if (isPlainObject(value) === true || isArray(value) === true) this.formatData(formData, value, `${prefixKey}[]`);
            else formData.append(prefixKey, value);
        }

        return formData;
    }

    fetch(url, options = {}) {
        const source = axios.CancelToken.source();
        const token = source.token;

        options.url = url;
        options.cancelToken = token;

        this.onFetchBefore(options);

        this.axios(this.prepareOptions(options))
            .then((response) => this.onFetchSuccess(options, response))
            .catch((error) => this.onFetchError(options, error));

        this.sources[token] = source;

        return token;
    }

    onFetchBefore(options) {
        if (options.debug === true) console.log('Server: fetch before:', { options });

        if (this.config.before === undefined || call(this.config.before, options) !== false) nextTick(() => call(options.before));
    }

    onFetchSuccess(options, response) {
        if (options.debug === true) console.log('Server: fetch success:', { options, response });

        if (this.config.success === undefined || call(this.config.success, options, response) !== false)
            this.doSuccess(options, response, response?.data);
    }

    onFetchError(options, error) {
        if (options.debug === true) console.error('Server: fetch error:', { options, error });

        if (this.config.error === undefined || call(this.config.error, options, error, error.response?.data) !== false)
            this.doError(options, error, error.response?.data);
    }

    doSuccess(options, response, data) {
        nextTick(() => {
            call(options.success, response, data);
            call(options.complete, true, response, data);
        });
    }

    doError(options, error, data) {
        nextTick(() => {
            call(options.error, error, data);
            call(options.complete, false, error, data);
        });
    }

    abort(tokens) {
        map(toArray(tokens), (token) => {
            if (this.sources[token] !== undefined) {
                this.sources[token].cancel();
                delete this.sources[token];
            }
        });
    }

    abortAll() {
        this.abort(this.sources);
    }
}

export default ServerHelperLib;
