'use strict';

/**
 * Get css value
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {element} el Element
 * @param {string} attr Element attribute
 * @return {mixed}
 */

export const cssValue = (el, attr) => {
    return window.getComputedStyle(el, null).getPropertyValue(attr);
};

export default cssValue;
