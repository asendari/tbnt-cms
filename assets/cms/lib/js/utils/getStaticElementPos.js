'use strict';

/**
 * Get the static absolute position of element
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {element} el Element to check
 * @return {integer}
 */

export const getStaticElementPos = (el) => {
    let top = el.offsetTop;
    let left = el.offsetLeft;

    while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }

    return { top, left };
};

export default getStaticElementPos;
