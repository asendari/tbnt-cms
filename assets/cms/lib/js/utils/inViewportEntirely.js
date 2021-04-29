'use strict';

/**
 * Check if element is entirely visible in viewport
 *
 * @version 1.0.2 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {element} el Element to check
 * @param {object} offset Element offset top and left
 * @return {boolean}
 */

import getWindowHeight from './getWindowHeight';
import getWindowWidth from './getWindowWidth';

export const inViewportEntirely = (el, offset = {}) => {
    offset = { top: offset.top || 0, left: offset.left || 0 };

    const rect = el.getBoundingClientRect();

    return (
        rect.top + offset.top >= 0 &&
        rect.left + offset.left >= 0 &&
        rect.right + offset.left <= getWindowWidth() &&
        rect.bottom + offset.top <= getWindowHeight()
    );
};

export default inViewportEntirely;
