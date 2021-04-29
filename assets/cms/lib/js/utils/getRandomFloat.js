'use strict';

/**
 * Random between two numbers (float, inclusive)
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {number} min Min
 * @param {number} max Max
 * @param {number} toFixed Decimals
 * @return {number}
 */

export const getRandomFloat = function (min, max, toFixed) {
    min = min || 0;
    max = max || 1;
    toFixed = toFixed === undefined ? 3 : toFixed;

    return parseFloat((Math.random() * (max - min) + min).toFixed(toFixed));
};

export default getRandomFloat;
