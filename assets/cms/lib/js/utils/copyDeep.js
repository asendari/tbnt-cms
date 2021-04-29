'use strict';

/**
 * Copy array of objects
 *
 * @version 1.0.0 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {array} array Array of objects to copy deep
 * @return {array}
 */

import cloneDeep from 'lodash/cloneDeep';
import map from 'lodash/map';

export const copyDeep = (array) => {
    return map(array, cloneDeep);
};

export default copyDeep;
