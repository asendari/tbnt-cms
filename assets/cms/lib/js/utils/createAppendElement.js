'use strict';

/**
 * Create element and append it to the dom
 *
 * @version 1.1.0 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {string} id Id
 * @return {Element}
 */

export const createAppendElement = (id) => {
    const existingParent = document.querySelector(`#${id}`);
    const parentElem = existingParent || createElement(id);

    if (existingParent === null) addRootElement(parentElem);

    return parentElem;
};

const createElement = (id) => {
    const rootContainer = document.createElement('div');

    rootContainer.setAttribute('id', id);

    return rootContainer;
};

const addRootElement = ($el) => {
    document.body.insertBefore($el, document.body.lastElementChild.nextElementSibling);
};

export default createAppendElement;
