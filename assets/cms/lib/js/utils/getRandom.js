'use strict';

/**
 * Random between two numbers (inclusive)
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {number} min Min
 * @param {number} max Max
 * @return {number}
 */

import getRandomFloat from './getRandomFloat';

export const getRandom = function (min, max) {
    return getRandomFloat(min, max, 0);
};

export default getRandom;
