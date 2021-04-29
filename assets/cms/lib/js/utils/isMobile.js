'use strict';

/**
 * Check mobile
 *
 * @version 1.0.3 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @return {boolean}
 */

const { detect } = require('detect-browser');

const browserOs = detect()?.os?.toLowerCase();

const amazon = () => browserOs.indexOf('amazon') !== -1;
const android = () => browserOs.indexOf('android') !== -1;
const blackberry = () => browserOs.indexOf('blackberry') !== -1;
const ios = () => browserOs.indexOf('ios') !== -1;
const windows = () => browserOs.indexOf('windows mobile') !== -1;

export const isMobile = {
    amazon,
    android,
    blackberry,
    ios,
    windows,
    any: () => amazon() || android() || blackberry() || ios() || windows(),
};

export default isMobile;
