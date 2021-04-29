'use strict';

/**
 * Convert rgba color to hex with background color
 *
 * @version 1.0.0 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {string|array} rgba RGBA color (rgb(255, 255, 255), rgba(255, 255, 255, 1), [255, 255, 255, 1])
 * @param {string|array} rgbBg Background color (#ffffff, rgb(255, 255, 255), rgba(255, 255, 255, 1), [255, 255, 255, 1?])
 * @return {string}
 */

import trim from 'lodash/trim';

import getRgba from './getRgba';
import isString from './isString';

export const rgbaToHex = (rgba, rgbBg = '#ffffff') => {
    if (isString(rgba) === true && trim(rgba).indexOf('#') === 0) return rgba;

    const rLeft = getRgba(rgba);
    const rRight = getRgba(rgbBg);

    const convert = (i) => Math.round(rLeft[i] * rLeft[3] + rRight[i] * (1 - rLeft[3])).toString(16);

    return '#' + convert(0) + convert(1) + convert(2);
};

export default rgbaToHex;
