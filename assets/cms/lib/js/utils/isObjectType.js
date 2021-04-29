'use strict';

/**
 * Get object name
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} obj Mixed
 * @param {string} name Object name
 * @param {boolean} strict Strict comparator
 * @return {string}
 */

import getObjectType from './getObjectType';

export const isObjectType = (obj, name = 'object', strict = false) => {
    if (obj === null) return obj === name;
    else if (strict === true) return getObjectType(obj).indexOf(name) !== -1;
    else return getObjectType(obj).toLowerCase().indexOf(name.toLowerCase()) !== -1;
};

export default isObjectType;
