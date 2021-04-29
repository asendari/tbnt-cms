'use strict';

import ObjectHelper from 'lib/js/helpers/object';

import DeviceConfig from './device';

const EffectConfig = new ObjectHelper({
    scrollo: {
        active: DeviceConfig.get('isIeEdge') === false,
        config: {
            autoDelay: 120,
            autoDelayRatio: 3,
            delay: DeviceConfig.get('isMobile') === true ? 0 : 80,
            offset: 80,
            duration: 1200,
            scrollReset: 90,
            tweens: {
                fade: {
                    from: { opacity: 0.001 },
                    to: { opacity: 1 },
                    duration: 2400,
                },
                'fade-up': {
                    from: { opacity: 0.001, translateY: 30 },
                    to: { opacity: 1, translateY: 0 },
                },
                'fade-left': {
                    from: { opacity: 0.001, translateX: 16 },
                    to: { opacity: 1, translateX: 0 },
                },
                'fade-right': {
                    from: { opacity: 0.001, translateX: -16 },
                    to: { opacity: 1, translateX: 0 },
                },
                'fade-down': {
                    from: { opacity: 0.001, translateY: -16 },
                    to: { opacity: 1, translateY: 0 },
                },
            },
        },
    },
    parallax: {
        active: DeviceConfig.get('isDesktop') === true && DeviceConfig.get('isIeEdge') === false,
    },
});

export default EffectConfig;
