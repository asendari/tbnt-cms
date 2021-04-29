'use strict';

/**
 * Force return number
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} number Number
 * @return {number}
 */

import varType from './varType';

export const forceNumber = (number, fallback = 0) => {
    number = Number(number);
    number = varType(number) !== 'number' || isNaN(number) === true ? fallback : number;

    return number;
};

export default forceNumber;
