'use strict';

/**
 * Return formatted className
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {array} classNames Class names
 * @return {string}
 */

import filter from 'lodash/filter';
import flattenDeep from 'lodash/flattenDeep';
import trim from 'lodash/trim';

import toArray from './toArray';

export const toClassName = (classNames) => {
    return trim(filter(flattenDeep(toArray(classNames))).join(' '));
};

export default toClassName;
