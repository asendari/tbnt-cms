'use strict';

/**
 * Get object name
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} obj Mixed
 * @return {string}
 */

import trim from 'lodash/trim';

export const getObjectType = (obj) => {
    return obj === null ? null : trim(Object.prototype.toString.call(obj).replace('[object', '').replace(']', ''));
};

export default getObjectType;
