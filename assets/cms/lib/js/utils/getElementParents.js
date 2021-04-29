'use strict';

/**
 * Get the parents of element
 *
 * @version 1.0.0 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {element} el Element to check
 * @param {string} selector Parents to get
 * @return {array}
 */

export const getElementParents = (el, selector) => {
    if ((selector || null) === null) return [];

    const elements = [];
    const comparator = typeof selector === 'string' ? 'matches' : 'isSameNode';

    let elem = el;

    while ((elem = elem.parentElement) !== null) {
        if (elem.nodeType !== Node.ELEMENT_NODE) continue;
        if (elem[comparator]?.(selector)) elements.push(elem);
    }

    return elements;
};

export default getElementParents;
