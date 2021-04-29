'use strict';

/**
 * Get the absolute position of element
 *
 * @version 1.0.2 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {element} el Element to check
 * @return {integer}
 */

export const getElementPos = (el) => {
    const documentRect = document.body.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    return {
        top: elRect.top - documentRect.top,
        left: elRect.left - documentRect.left,
        right: documentRect.right - elRect.right,
        bottom: documentRect.bottom - elRect.bottom,
    };
};

export default getElementPos;
