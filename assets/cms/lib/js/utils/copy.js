'use strict';

/**
 * Copy array of objects
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {array} array Array of objects to copy
 * @return {array}
 */

import clone from 'lodash/clone';
import map from 'lodash/map';

export const copy = (array) => {
    return map(array, clone);
};

export default copy;
