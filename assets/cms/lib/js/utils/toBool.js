'use strict';

/**
 * Convert value to boolean
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} value Value to convert
 * @return {boolean}
 */

export const toBool = (value) => {
    switch (String(value).toLowerCase()) {
        case 1:
        case true:
        case '1':
        case 'true':
            return true;
            break;
        default:
            return false;
            break;
    }
};

export default toBool;
