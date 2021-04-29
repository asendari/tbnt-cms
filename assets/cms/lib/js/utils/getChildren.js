'use strict';

/**
 * Init/flatten/filter children
 *
 * @version 1.0.0 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {array} children Children
 * @return {array}
 */

import filter from 'lodash/filter';
import flatten from 'lodash/flatten';

import isArray from 'lib/js/utils/isArray';

export const getChildren = (children) => {
    return filter(children ? flatten(isArray(children) ? children : [children]) : []);
};

export default getChildren;
