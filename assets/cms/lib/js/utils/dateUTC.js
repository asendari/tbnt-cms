'use strict';

/**
 * Convert date to UTC string
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {string} value Date value
 * @return {string}
 */

export const dateUTC = (value) => {
    return `${value.split(' ').join('T')}Z`;
};

export default dateUTC;
