'use strict';

/**
 * Check navigator
 *
 * @version 1.0.3 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @return {boolean}
 */

const { detect } = require('detect-browser');

const browserName = detect()?.name?.toLowerCase();

const chrome = () => browserName.indexOf('chrome') !== -1 || browserName.indexOf('crios') !== -1;
const edge = () => browserName.indexOf('edge') !== -1;
const firefox = () => browserName.indexOf('firefox') !== -1;
const ie = () => browserName.indexOf('ie') !== -1 && browserName.indexOf('ios') === -1;
const opera = () => browserName.indexOf('opera') !== -1;
const safari = () => browserName.indexOf('safari') !== -1 || browserName.indexOf('ios') !== -1;

const ieEdge = () => ie() || edge();

export const isNavigator = {
    chrome,
    edge,
    firefox,
    ie,
    ieEdge,
    opera,
    safari,
    any: () => chrome() || firefox() || ieEdge() || opera() || safari(),
};

export default isNavigator;
