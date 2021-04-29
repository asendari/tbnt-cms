'use strict';

/**
 * Toggle item in array: removed if present, added if missing
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {array} array Array
 * @param {item} item Item to toggle
 * @return {array}
 */

import copy from './copy';

export const toggle = (array, item) => {
    const arr = copy(array);
    const pos = arr.indexOf(item);

    if (pos === -1) arr.push(item);
    else arr.splice(pos, 1);

    return arr;
};

export default toggle;
