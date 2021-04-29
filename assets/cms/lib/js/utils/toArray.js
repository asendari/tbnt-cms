'use strict';

/**
 * Convert values to array
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} values Values to convert
 * @return {array}
 */

export const toArray = (values) => {
    return Array.isArray(values) === true ? values : [values];
};

export default toArray;
