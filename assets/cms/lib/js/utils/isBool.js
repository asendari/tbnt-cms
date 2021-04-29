'use strict';

/**
 * Check if var type if boolean
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} mixed Var
 * @return {boolean}
 */

import varType from './varType';

export const isBool = (mixed) => {
    return varType(mixed) === 'boolean';
};

export default isBool;
