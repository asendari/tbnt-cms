'use strict';

/**
 * Remove brackets
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {string} str String to clean
 * @return {string}
 */

import trimEnd from 'lodash/trimEnd';
import trimStart from 'lodash/trimStart';

export const removeBrackets = (str) => {
    return trimEnd(trimStart(str, '['), ']');
};

export default removeBrackets;
