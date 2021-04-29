'use strict';

/**
 * List the class methods
 *
 * @version 1.0.0 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {object} object Object to get methods
 * @return {array}
 */

import difference from 'lodash/difference';

const removeMethods = ['constructor'];

export const getClassMethods = (object) => {
    return difference(Object.getOwnPropertyNames(Object.getPrototypeOf(object)), removeMethods);
};

export default getClassMethods;
