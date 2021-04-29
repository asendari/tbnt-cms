'use strict';

/**
 * Deeply flatten an deeeply object/array
 *
 * @version 1.0.0 - 2019-12-18
 * @author Alexandre Pilloud
 *
 * @param {mixed} items Items
 * @return {array}
 */

import flattenDeep from 'lodash/flattenDeep';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import map from 'lodash/map';

export const flatten = (items) => {
    return flattenDeep(values(items));
};

const values = (n) => (isArray(n) || isPlainObject(n) ? map(n, values) : n);

export default flatten;
