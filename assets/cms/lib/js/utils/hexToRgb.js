'use strict';

/**
 * Convert hex color to rgb string
 *
 * @version 1.0.0 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {string} hex HEX color (#ffffff)
 * @return {string}
 */

import trim from 'lodash/trim';

import isString from './isString';

export const hexToRgb = (hex) => {
    if (isString(hex) === true && trim(hex).indexOf('rgb') === 0) return hex;

    return `rgb(${trim(hex.indexOf('#') === -1 ? '#' + hex : hex)
        .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1)
        ?.match(/.{2}/g)
        .map((x) => parseInt(x, 16))
        .join(', ')})`;
};

export default hexToRgb;
