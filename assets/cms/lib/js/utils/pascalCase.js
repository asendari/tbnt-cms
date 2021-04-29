'use strict';

/**
 * Return PascalCase string
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {string} str String
 * @return {string}
 */

import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';

export const pascalCase = (str) => {
    return upperFirst(camelCase(str));
};

export default pascalCase;
