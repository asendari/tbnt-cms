'use strict';

/**
 * Format number
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {number} price Number to format
 * @param {number} c Decimal
 * @param {string} d Dot separator
 * @param {string} t Thousand separator
 * @return {string}
 */

export const formatNum = (price, c, d, t) => {
    var n = price,
        c = isNaN((c = Math.abs(c))) ? 2 : c,
        d = d == undefined ? '.' : d,
        t = t == undefined ? "'" : t,
        s = n < 0 ? '-' : '',
        i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
        j = (j = i.length) > 3 ? j % 3 : 0;

    return (
        s +
        (j ? i.substr(0, j) + t : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
        (c
            ? d +
              Math.abs(n - i)
                  .toFixed(c)
                  .slice(2)
            : '')
    );
};

export default formatNum;
