'use strict';

/**
 * Trim char string
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @return {string}
 */

import escapeRegExp from './escapeRegExp';

export const trimChar = (origString, charToTrim = ' ') => {
    charToTrim = escapeRegExp(charToTrim);
    var regEx = new RegExp('^[' + charToTrim + ']+|[' + charToTrim + ']+$', 'g');

    return origString.replace(regEx, '');
};

export default trimChar;
