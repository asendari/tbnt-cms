'use strict';

/**
 * Get and cache innerHeight result
 *
 * @version 1.0.2 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {boolean} force Force recalculate
 * @return {number}
 */

export const getWindowHeight = (force = false) => {
    if (force === true || window._innerHeight === undefined)
        window._innerHeight = window.innerHeight || document.documentElement.clientHeight;

    return window._innerHeight;
};

export default getWindowHeight;
