'use strict';

/**
 * Copy object value of objects
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {array} array Array of objects to copy
 * @return {array}
 */

import clone from 'lodash/clone';
import mapValues from 'lodash/mapValues';

export const copyValues = (array) => {
    return mapValues(array, clone);
};

export default copyValues;
