'use strict';

/**
 * Extract R, G, B and A values from color string
 *
 * @version 1.0.1 - 2019-12-18
 * @author Alexandre Pilloud
 *
 * @param {string|array} Rgba color (#ffffff, rgb(255, 255, 255), rgba(255, 255, 255, 1), [255, 255, 255, 1?])
 * @return {array}
 */

import map from 'lodash/map';

import hexToRgb from './hexToRgb';
import isArray from './isArray';

export const getRgba = (rgba) => {
    const rgbaArray = map(
        isArray(rgba) === true ? rgba : (hexToRgb(rgba)?.match(/^rgba?[\s+]?\((.*)\)/i)[1] ?? '').split(','),
        (v) => Number(v),
    );

    return [rgbaArray[0] || 0, rgbaArray[1] || 0, rgbaArray[2] || 0, isNaN(rgbaArray[3]) ? 1 : rgbaArray[3]];
};

export default getRgba;
