'use strict';

/**
 * Polyfill ResizeObserver
 *
 * @version 1.0.0 - 2019-11-28
 * @author Alexandre Pilloud
 */

import ResizeObserverPolyfill from 'resize-observer-polyfill';

export const ResizeObserver = window.ResizeObserver || ResizeObserverPolyfill;

export default ResizeObserver;
