'use strict';

/**
 * Get css value number
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {element} el Element
 * @param {string} attr Element attribute
 * @return {mixed}
 */

import cssValue from './cssValue';

export const cssValueInt = (el, attr) => {
    return parseInt(cssValue(el, attr));
};

export default cssValueInt;
