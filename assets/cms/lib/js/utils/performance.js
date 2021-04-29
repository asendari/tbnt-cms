'use strict';

/**
 * Console performance
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {mixed} data Data
 * @return {void}
 */

let startTime = 0;
let lastTime = 0;

export const performance = {
    start: () => {
        startTime = window.performance.now();
        lastTime = startTime + 0;
    },
    logStart: () => {
        console.log(`Performance:took: ${window.performance.now() - startTime}ms`);
    },
    logLast: () => {
        console.log(`Performance:took: ${window.performance.now() - lastTime}ms`);
        lastTime = window.performance.now();
    },
};

export default performance;
