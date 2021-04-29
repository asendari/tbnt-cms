'use strict';

/**
 * Same as get, but setWith value if has not value
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {object} object Object to get
 * @param {string} path Path to get
 * @param {mixed} defaultValue Default value
 * @param {object} type Set with type
 * @return {mixed}
 */

import get from 'lodash/get';
import has from 'lodash/has';
import setWith from 'lodash/setWith';

export const getSetWith = (object, path, defaultValue, type = Object) => {
    if (has(object, path) === false) setWith(object, path, defaultValue, type);

    return get(object, path);
};

export default getSetWith;
