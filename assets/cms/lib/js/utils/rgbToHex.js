'use strict';

/**
 * Convert rgb color to hex
 *
 * @version 1.0.3 - 2019-12-18
 * @author Alexandre Pilloud
 *
 * @param {string} rgb RGB color
 * @return {string}
 */

import map from 'lodash/map';
import padStart from 'lodash/padStart';
import trim from 'lodash/trim';

import isArray from './isArray';
import isString from './isString';
import padArray from './padArray';

export const rgbToHex = (r, g, b) => {
    if (isString(r) === true && trim(r).indexOf('#') === 0) return r;

    return (
        '#' +
        map(
            padArray(
                isArray(r) === true
                    ? r
                    : g !== undefined && b !== undefined
                    ? [r, g, b]
                    : rgb?.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i),
                3,
                0,
            ),
            (x) => padStart(trim(x).toString(16), 2, '0'),
        ).join('')
    );
};

export default rgbToHex;
