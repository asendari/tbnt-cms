'use strict';

/**
 * Check if function is noop
 *
 * @version 1.0.2 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {function} func Function
 * @return {boolean}
 */

import noop from 'lodash/noop';

export const isNoop = (func) => {
    return (func ?? '').toString() === noop.toString();
};

export default isNoop;
