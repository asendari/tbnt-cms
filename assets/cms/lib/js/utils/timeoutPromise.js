'use strict';

/**
 * Add timeout to a promise
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {number} ms Timeout
 * @param {promise} promise Promise
 * @param {string} name Name in timeout stacks
 * @return {promise}
 */

import uniqueId from 'lodash/uniqueId';

let timeoutStack = {};

export const timeoutPromise = (ms, promise, name = '') => {
    if (name === '') name = uniqueId();
    else clearTimeout(timeoutStack[name]);

    return new Promise((resolve, reject) => {
        timeoutStack[name] = setTimeout(() => {
            reject(new Error('timeout'));
        }, ms || 30000);

        promise.then(
            (res) => {
                clearTimeout(timeoutStack[name]);
                resolve(res);
            },
            (err) => {
                clearTimeout(timeoutStack[name]);
                reject(err);
            },
        );
    });
};

export default timeoutPromise;
