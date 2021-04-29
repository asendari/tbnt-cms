'use strict';

/**
 * Call callback
 *
 * @version 1.0.3 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {function} callback Callback
 * @return {mixed}
 */

const resolvedPromise = typeof Promise === 'undefined' ? null : Promise.resolve();

export const nextTick = (callback) => {
    resolvedPromise === null ? setTimeout(callback) : resolvedPromise.then(callback).catch(console.error);
};

export default nextTick;
