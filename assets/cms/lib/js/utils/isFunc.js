'use strict';

/**
 * Check if var type if function
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} mixed Var
 * @return {boolean}
 */

import varType from './varType';

export const isFunc = (mixed) => {
    return varType(mixed) === 'function';
};

export default isFunc;
