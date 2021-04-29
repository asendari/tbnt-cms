'use strict';

/**
 * Sort object keys
 *
 * @version 1.0.0 - 2019-12-18
 * @author Alexandre Pilloud
 *
 * @param {object} obj Object to sort
 * @return {object}
 */

import fromPairs from 'lodash/fromPairs';
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';

export const sortKeys = (obj) => {
    return fromPairs(sortBy(toPairs(obj), 0));
};

export default sortKeys;
