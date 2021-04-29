'use strict';

/**
 * Leading strings
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {string} str String to add leading string
 * @param {number} count Prefix count
 * @param {string} prefix Prefix
 * @param {boolean} truncate Truncate at count
 * @return {string}
 */

import fill from 'lodash/fill';

export const leadingString = (str, count, prefix = '0', truncate = false) => {
    str = String(str);
    count = count < 1 ? 1 : count;

    return truncate === false && str.length > count ? str : String(fill(Array(count), prefix).join('') + str).substr(0 - count);
};

export default leadingString;
