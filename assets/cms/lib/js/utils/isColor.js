'use strict';

/**
 * Check if string is color value
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {string} color Color
 * @return {boolean}
 */

import startsWith from 'lodash/startsWith';

export const isColor = (color) => {
    return (
        startsWith(color, '#') ||
        startsWith(color, 'rgb(') ||
        startsWith(color, 'rgba(') ||
        startsWith(color, 'hsl(') ||
        startsWith(color, 'hsla(')
    );
};

export default isColor;
