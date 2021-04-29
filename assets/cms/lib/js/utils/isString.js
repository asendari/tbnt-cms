'use strict';

/**
 * Check if var type if string
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} mixed Var
 * @return {boolean}
 */

import varType from './varType';

export const isString = (mixed) => {
    return varType(mixed) === 'string';
};

export default isString;
