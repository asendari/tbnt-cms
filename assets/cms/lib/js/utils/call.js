'use strict';

/**
 * Call callback
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {function} callback Callback
 * @return {mixed}
 */

import isFunc from './isFunc';

export const call = (callback, ...args) => {
    return isFunc(callback) === true ? callback(...args) : callback;
};

export default call;
