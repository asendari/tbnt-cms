'use strict';

/**
 * Random item in array
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {array} items Array
 * @return {mixed}
 */

import getRandom from './getRandom';

export const getRandomItem = function (items) {
    return items[getRandom(0, items.length - 1)];
};

export default getRandomItem;
