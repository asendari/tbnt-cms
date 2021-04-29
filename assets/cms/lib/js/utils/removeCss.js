'use strict';

/**
 * Remove style from element
 *
 * @version 1.0.0 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {string} styles Styles
 * @return {void}
 */

import map from 'lodash/map';

import toArray from './toArray';

export const removeCss = (el, styles) => {
    el && map(toArray(styles), (property) => el.style.removeProperty(property));
};

export default removeCss;
