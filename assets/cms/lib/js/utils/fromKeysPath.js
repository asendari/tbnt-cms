'use strict';

/**
 * Convert object with keys as path to a nested object
 *
 * @version 1.0.0 - 2019-12-18
 * @author Alexandre Pilloud
 *
 * @param {object} items Items
 * @return {object}
 */

import isPlainObject from 'lodash/isPlainObject';
import map from 'lodash/map';
import setWith from 'lodash/setWith';
import reduce from 'lodash/reduce';

import isArray from 'lib/js/utils/isArray';

export const fromKeysPath = (items) => {
    return isPlainObject(items) === false
        ? items
        : reduce(
              items,
              (result, value, key) =>
                  setWith(result, key, isArray(value) === true ? map(value, fromKeysPath) : fromKeysPath(value), Object),
              {},
          );
};

export default fromKeysPath;
