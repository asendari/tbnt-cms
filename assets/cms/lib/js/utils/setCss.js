'use strict';

/**
 * Set style to element
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {string} styles Styles
 * @return {void}
 */

import map from 'lodash/map';

import removeCss from './removeCss';

export const setCss = (el, styles) => {
    const { clearProps, ...addStyle } = styles;

    el &&
        map(addStyle, (value, property) => {
            el.style[property] = value;
        });

    removeCss(el, clearProps);
};

export default setCss;
