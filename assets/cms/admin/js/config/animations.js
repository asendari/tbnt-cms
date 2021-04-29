'use strict';

import ObjectHelper from 'lib/js/helpers/object';

import merge from 'lodash/merge';
import noop from 'lodash/noop';

const getOptions = (...options) => {
    return merge({ duration: 0.6, from: {}, to: {}, onComplete: noop, ease: Expo.easeOut }, ...options);
};

const AnimationConfig = new ObjectHelper({
    fadeIn: (el, options = {}) => {
        options = getOptions(options);

        return TweenLite.fromTo(
            el,
            options.duration,
            { opacity: 0.001, pointerEvents: 'none', ...options.from },
            {
                opacity: 1,
                clearProps: 'opacity,pointerEvents',
                onComplete: options.onComplete,
                ease: options.ease,
                ...options.to,
            },
        );
    },
    fadeOut: (el, options = {}) => {
        options = getOptions({ duration: 0.4 }, options);

        return TweenLite.fromTo(
            el,
            options.duration,
            { opacity: 1, pointerEvents: 'none', ...options.from },
            {
                opacity: 0.001,
                clearProps: 'opacity,pointerEvents',
                onComplete: options.onComplete,
                ease: options.ease,
                ...options.to,
            },
        );
    },
    scrollTo: (el, y = 0, options = {}) => {
        options = getOptions({ ease: Power2.easeInOut }, options);

        return TweenLite.fromTo(
            el,
            options.duration,
            { pointerEvents: 'none', ...options.from },
            {
                scrollTo: { y, autoKill: false },
                clearProps: 'pointerEvents',
                onComplete: options.onComplete,
                ease: options.ease,
                ...options.to,
            },
        );
    },
});

export default AnimationConfig;
