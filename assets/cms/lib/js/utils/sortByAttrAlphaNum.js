'use strict';

/**
 * Natural sort array of objects with property
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
import set from 'lodash/set';

export const sortByAttrAlphaNum = (arr, path, options = {}) => {
    options = assign(
        {
            caseInsensitive: true,
            default: path,
            reverse: false,
        },
        options,
    );

    for (let z = 0, t; (t = arr[z] && get(arr[z], path, options.default)); z++) {
        let tz = [];
        let x = 0,
            y = -1,
            n = 0,
            i,
            j;

        while ((i = (j = String(t).charAt(x++)).charCodeAt(0))) {
            let m = i == 46 || (i >= 48 && i <= 57);
            if (m !== n) {
                tz[++y] = '';
                n = m;
            }
            tz[y] += j;
        }

        set(arr[z], path, tz);
    }

    arr.sort(function (x, y) {
        let a = get(x, path, options.default);
        let b = get(y, path, options.default);

        for (let x = 0, aa, bb; (aa = a[x]) && (bb = b[x]); x++) {
            if (options.caseInsensitive) {
                aa = aa.toLowerCase();
                bb = bb.toLowerCase();
            }
            if (aa !== bb) {
                let c = Number(aa),
                    d = Number(bb);
                if (c == aa && d == bb) {
                    return c - d;
                } else return aa > bb ? 1 : -1;
            }
        }
        return a.length - b.length;
    });

    for (let z = 0; z < arr.length; z++) set(arr[z], path, get(arr[z], path, options.default).join(''));

    if (options.reverse === true) return arr.reverse();

    return arr;
};

export default sortByAttrAlphaNum;
