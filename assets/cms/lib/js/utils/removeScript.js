'use strict';

/**
 * Remove script from head
 *
 * @version 1.0.2 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {string} script Script
 * @return {void}
 */

const head = document.head || document.getElementsByTagName('head')[0];

export const removeScript = (script) => {
    if (document.contains(script) === true) head.removeChild(script);
};

export default removeScript;
