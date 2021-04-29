'use strict';

/**
 * Get all combinations
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {array} chars Items
 * @param {string} separator String separator
 * @return {array}
 */

export const getCombinations = (chars, separator = '') => {
    let result = [];

    f('', chars, separator);

    return result;
};

const f = (prefix, chars, separator) => {
    for (let i = 0, c = chars.length; i < c; i++) {
        result.push(prefix + chars[i]);
        f(prefix + chars[i] + separator, chars.slice(i + 1), separator);
    }
};

export default getCombinations;
