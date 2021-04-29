'use strict';

/**
 * Check if var type if mixed is a no noop function
 *
 * @version 1.0.0 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} mixed Var
 * @return {boolean}
 */

import isFunc from './isFunc';
import isNoop from './isNoop';

export const isFuncOp = (mixed) => {
    return isFunc(mixed) === true && isNoop(mixed) === false;
};

export default isFuncOp;
