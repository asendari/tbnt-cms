'use strict';

/**
 * Append style to head
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {string} styles Styles
 * @return {void}
 */

export const addStyle = (styles) => {
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');

    style.type = 'text/css';
    style.appendChild(document.createTextNode(styles));

    head.appendChild(style);

    return style;
};

export default addStyle;
