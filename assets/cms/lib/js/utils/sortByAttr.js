'use strict';

/**
 * Sort array of objects with property
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {array} arr Array to sort
 * @param {string} path Object path
 * @return {array}
 */

import assign from 'lodash/assign';
import get from 'lodash/get';

export const sortByAttr = (arr, path, options = {}) => {
    options = assign(
        {
            caseInsensitive: true,
            default: path,
            reverse: false,
        },
        options,
    );

    arr.sort(function (a, b) {
        let x = get(a, path, options.default);
        let y = get(b, path, options.default);

        if (options.caseInsensitive) {
            x = String(x).toLowerCase();
            y = String(y).toLowerCase();
        }

        return x < y ? -1 : x > y ? 1 : 0;
    });

    if (options.reverse === true) return arr.reverse();

    return arr;
};

export default sortByAttr;
