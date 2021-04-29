'use strict';

/**
 * Check if var type if number
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} mixed Var
 * @return {boolean}
 */

import varType from './varType';

export const isNumber = (mixed) => {
    return varType(mixed) === 'number';
};

export default isNumber;
