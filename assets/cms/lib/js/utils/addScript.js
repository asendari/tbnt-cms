'use strict';

/**
 * Append script to head
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {string} src Script src
 * @param {object} options Script options
 * @return {void}
 */

export const addScript = (src, options = {}) => {
    const head = document.head || document.getElementsByTagName('head')[0];
    const script = document.createElement('script');

    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');

    if (options.async === true) script.setAttribute('async', 'async');
    if (options.defer === true) script.setAttribute('defer', 'defer');

    head.appendChild(script);

    return script;
};

export default addScript;
