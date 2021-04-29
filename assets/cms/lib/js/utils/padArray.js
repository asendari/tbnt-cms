'use strict';

/**
 * Pad an array
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {array} arr Array
 * @param {number} length Array target length
 * @param {mixed} fill Blank value
 * @param {boolean} start Pad from start
 * @return {array}
 */

export const padArray = (arr, length, fill = null, start = false) => {
    if (arr.length >= length) return arr;

    const blankItems = Array(length - arr.length).fill(fill);

    return start === true ? blankItems.concat(arr) : arr.concat(blankItems);
};

export default padArray;
