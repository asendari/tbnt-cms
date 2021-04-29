'use strict';

/**
 * Convert array values to object
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} values Values to convert
 * @return {object}
 */

import map from 'lodash/map';
import zipObject from 'lodash/zipObject';

export const toObject = (values, cb) => {
    return zipObject(values, map(values, cb));
};

export default toObject;
