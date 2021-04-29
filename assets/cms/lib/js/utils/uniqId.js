'use strict';

/**
 * Get unique identifier
 *
 * @version 1.0.2 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {boolean} append Append uniq increment
 * @return {string}
 */

let _uniqId_increment = 0;

export const uniqId = (append = '') => {
    return `${String(new Date().getTime())}-${(_uniqId_increment += 1)}${append ? `-${append}` : ''}`;
};

export default uniqId;
