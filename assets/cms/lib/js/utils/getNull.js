'use strict';

/**
 * Same as get, but default with "undefined" and "null"
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {object} object Object to get
 * @param {string} path Path to get
 * @param {mixed} defaultValue Default value
 * @return {mixed}
 */

import get from 'lodash/get';

export const getNull = (object, path, defaultValue) => {
    return get(object, path, defaultValue) ?? defaultValue;
};

export default getNull;
