'use strict';

/**
 * Same as get, but set value if has not value
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
import has from 'lodash/has';
import set from 'lodash/set';

export const getSet = (object, path, defaultValue) => {
    if (has(object, path) === false) set(object, path, defaultValue);

    return get(object, path);
};

export default getSet;
