'use strict';

/**
 * Check if value is object
 *
 * @version 1.1.0 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} value Value to check
 * @return {boolean}
 */

export const isObject = (value) => {
    return typeof value === 'object' && Array.isArray(value) === false;
};

export default isObject;
