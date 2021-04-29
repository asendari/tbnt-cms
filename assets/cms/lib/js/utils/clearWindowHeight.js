'use strict';

/**
 * Clear cached window._innerHeight result
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @return {number}
 */

export const clearWindowHeight = () => {
    window._innerHeight = undefined;
};

export default clearWindowHeight;
