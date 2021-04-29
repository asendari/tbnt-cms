'use strict';

/**
 * Perform a quick shallow comparison between 2 objects. This can be used in shouldComponentUpdate.
 *
 * @version 1.0.0 - 2019-12-19
 * @author https://tung-dang.github.io/some-react-performance-take-away-tips
 *
 * @param obj1
 * @param obj2
 * @param {Array} omitProps - array of props which will be ingored to compare
 * @returns {boolean}
 */

import keys from 'lodash/keys';
import union from 'lodash/union';

export const isShallowEqual = (obj1, obj2, onlyProps = null) => {
    if (obj1 === obj2) return true;

    const allKeys = union(keys(obj1), keys(obj2));

    for (const key of allKeys) {
        if (onlyProps?.indexOf(key) === -1) continue;
        if (obj1[key] !== obj2[key]) return false;
    }

    return true;
};

export default isShallowEqual;
