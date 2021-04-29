'use strict';

/**
 * Check if value is jquery object
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} obj Mixed
 * @return {string}
 */

export const isJquery = (obj) => {
    return typeof obj === 'object' && obj && obj['jquery'];
};

export default isJquery;
