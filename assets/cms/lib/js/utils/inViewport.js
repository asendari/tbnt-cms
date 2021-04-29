'use strict';

/**
 * Check if element is visible in viewport
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

export const inViewport = (el, offset = {}) => {
    offset = {
        top: offset.top || 0,
        left: offset.left || 0,
    };

    const rect = el.getBoundingClientRect();
    const vWidth = getWindowWidth();
    const vHeight = getWindowHeight();

    const position = {
        top: rect.top + offset.top,
        left: rect.left + offset.left,
        right: rect.right + offset.left,
        bottom: rect.bottom + offset.top,
    };

    // Return false if it's not in the viewport
    if (position.right < 0 || position.bottom < 0 || position.left > vWidth || position.top > vHeight) return false;

    // Return true if any of its four corners are visible
    return (
        (position.top >= 0 && position.top <= vHeight) ||
        (position.left >= 0 && position.left <= vWidth) ||
        (position.right >= 0 && position.right <= vHeight) ||
        (position.bottom >= 0 && position.bottom <= vWidth)
    );
};

export default inViewport;
