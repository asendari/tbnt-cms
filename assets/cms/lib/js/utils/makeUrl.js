'use strict';

/**
 * Format url with slashes between parts
 *
 * @version 1.0.2 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {array} parts URL parts
 * @param {boolean} suffix Prepend slash
 * @param {boolean} http Prepend http
 * @return {string}
 */

import filter from 'lodash/filter';
import map from 'lodash/map';
import trim from 'lodash/trim';

import toArray from './toArray';

export const makeUrl = (parts, suffix = false, http = false) => {
    const url = trim(filter(map(toArray(parts), (part) => trim(part, '/'))).join('/'), '/');

    return http === true ? (url.indexOf('http') !== 0 ? `//${url}` : url) : suffix === true ? `/${url}` : url;
};

export default makeUrl;
