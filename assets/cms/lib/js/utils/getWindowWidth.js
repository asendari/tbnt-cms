'use strict';

/**
 * Get and cache window.innerWidth result
 *
 * @version 1.0.2 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {boolean} force Force recalculate
 * @return {number}
 */

export const getWindowWidth = (force = false) => {
    if (force === true || window._innerWidth === undefined)
        window._innerWidth = window.innerWidth || document.documentElement.clientWidth;

    return window._innerWidth;
};

export default getWindowWidth;
