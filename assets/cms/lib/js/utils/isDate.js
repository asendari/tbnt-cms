'use strict';

/**
 * Check if var type if date
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} date Var
 * @return {boolean}
 */

import isObjectType from './isObjectType';

export const isDate = (date) => {
    return isObjectType(date, 'Date');
};

export default isDate;
