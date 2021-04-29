'use strict';

/**
 * Format object to CSS style string
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {object} styles Styles
 * @return {string}
 */

export const toStyle = (styles) => {
    return Object.entries(styles).reduce((styleString, [propName, propValue]) => {
        return `${styleString}${propName}:${propValue};`;
    }, '');
};

export default toStyle;
