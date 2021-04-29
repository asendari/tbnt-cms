'use strict';

/**
 * Escape special characters for use in a regular expression
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @return {string}
 */

export const escapeRegExp = (strToEscape) => {
    return strToEscape.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

export default escapeRegExp;
