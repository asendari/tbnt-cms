'use strict';

/**
 * Console JSON
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} data Data
 * @return {void}
 */

export const warnJson = (data, withTimestamp) => {
    if (withTimestamp === true) console.warn(JSON.stringify(data), uniqId());
    else console.warn(JSON.stringify(data));
};

export default warnJson;
