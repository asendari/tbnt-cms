'use strict';

import isMobile from 'lib/js/utils/isMobile';
import isNavigator from 'lib/js/utils/isNavigator';

import ObjectHelper from 'lib/js/helpers/object';

const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
const isModeNotSpecified = window.matchMedia('(prefers-color-scheme: no-preference)').matches;

const DeviceConfig = new ObjectHelper({
    isMobile: isMobile.any(),
    isDesktop: isMobile.any() === false,
    isAndroid: isMobile.android(),
    isIOS: isMobile.ios(),
    isChrome: isNavigator.chrome(),
    isFirefox: isNavigator.firefox(),
    isSafari: isNavigator.safari(),
    isIe: isNavigator.ie(),
    isIeEdge: isNavigator.ieEdge(),
    isEdge: isNavigator.edge(),
    isDarkMode,
    isLightMode,
    isModeNotSpecified,
    hasNoModeSupport: isDarkMode === false && isLightMode === false && isModeNotSpecified === false,
});

export default DeviceConfig;
