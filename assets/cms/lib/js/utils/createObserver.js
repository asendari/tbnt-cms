'use strict';

/**
 * ResizeObserver instanciator
 *
 * @version 1.0.0 - 2019-11-28
 * @author Alexandre Pilloud
 */

import ResizeObserver from './resizeObserver';

export const createObserver = (cb) => new ResizeObserver(cb);

export default createObserver;
