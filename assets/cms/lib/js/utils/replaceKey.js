'use strict';

/**
 * Replace object key
 *
 * @version 1.0.0 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {object} obj Object
 * @param {string} oldKey Old key
 * @param {string} newKey New key
 * @param {boolean} resetValue Reset value
 * @return {object}
 */

import reduce from 'lodash/reduce';

export const replaceKey = (obj, oldKey, newKey, resetValue = null) => {
    return reduce(
        obj,
        function (result, value, key) {
            const shouldReplace = key === oldKey;
            result[shouldReplace === true ? newKey : key] = shouldReplace === true ? resetValue ?? value : value;
            return result;
        },
        {},
    );
};

export default replaceKey;
