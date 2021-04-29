'use strict';

/**
 * Clear cached window.innerWidth result
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @return {number}
 */

export const clearWindowWidth = () => {
    window._innerWidth = undefined;
};

export default clearWindowWidth;
