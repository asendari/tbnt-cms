'use strict';

/**
 * Filter out null and undefined but keep empty, numeric and boolean values
 *
 * @version 1.0.0 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {array} items Items
 * @return {array}
 */

import filter from 'lodash/filter';

export const filterNull = (items) => {
    return filter(items, (v) => v !== null && v !== undefined);
};

export default filterNull;
