'use strict';

/**
 * Remove style from head
 *
 * @version 1.0.2 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {string} styles Styles
 * @return {void}
 */

import removeScript from './removeScript';

export const removeStyle = (styles) => {
    removeScript(styles);
};

export default removeStyle;
