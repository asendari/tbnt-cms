'use strict';

/**
 * @name ScrolloPluginLib
 * @description Scrollo Plugin for ReactJS personal library
 * @file ReactJS Scrollo Plugin
 *
 * @version 1.1.6 - 2019-12-18
 * @author Alexandre Pilloud
 */

import fastdom from 'fastdom';
import * as Rematrix from 'rematrix';

import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import keys from 'lodash/keys';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import reduce from 'lodash/reduce';
import throttle from 'lodash/throttle';
import values from 'lodash/values';

import addStyle from 'lib/js/utils/addStyle';
import inViewport from 'lib/js/utils/inViewport';
import isMobile from 'lib/js/utils/isMobile';
import nextTick from 'lib/js/utils/nextTick';
import pascalCase from 'lib/js/utils/pascalCase';
import toArray from 'lib/js/utils/toArray';
import toStyle from 'lib/js/utils/toStyle';

const cssProps = ['opacity'];

const transformProps = [
    'rotate',
    'rotateX',
    'rotateY',
    'rotateZ',
    'scale',
    'scaleX',
    'scaleY',
    'scaleZ',
    'skew',
    'skewX',
    'skewY',
    'translate',
    'translateX',
    'translateY',
    'translateZ',
];

const allowedProps = [...cssProps, ...transformProps];

const defaultConfig = {
    data: 'scrollo',
    animation: 'fade-up',
    origin: 'center',
    function: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
    autoDelay: 80,
    autoDelayRatio: 3,
    delay: 120,
    offset: 0,
    duration: 1200,
    mobile: true,
    scrollReset: 90,
    container: window,
    readyClass: null,
    animateClass: null,
    animatedClass: null,
    tweens: {
        fade: {
            from: { opacity: 0.001 },
            to: { opacity: 1 },
        },
        'fade-up': {
            from: { opacity: 0.001, translateY: 60 },
            to: { opacity: 1, translateY: 0 },
        },
    },
};

const overridableConfig = ['origin', 'function', 'offset', 'duration'];

class ScrolloPluginLib {
    elementsToCheck = [];
    elementsToAnimate = [];

    isMeasuring = false;
    isAnimating = false;

    index = 0;
    lastScrollY = 0;

    debounceIndex = null;
    debounceInserted = null;

    transforms = {};

    constructor(config = {}) {
        this.config = merge({}, defaultConfig, config);
        this.isMobile = this.config.mobile === false && isMobile.any() === true;

        if (this.isMobile === true) return;

        this.containerEl = this.config.container === window ? document : this.config.container;

        this.readyClass = this.config.readyClass || `${this.config.data}-ready`;
        this.animateClass = this.config.animateClass || `${this.config.data}-animate`;
        this.animatedClass = this.config.animatedClass || `${this.config.data}-animated`;

        const matrices = mapValues(this.config.tweens, (tweens, animation) => {
            this.config.tweens[animation] = merge({}, pick(this.config, overridableConfig), tweens);

            return {
                from: map(toArray(tweens.from), (props) =>
                    pick(
                        mapValues(props, (value, tween) =>
                            transformProps.indexOf(tween) !== -1 ? Rematrix[tween](value) : value,
                        ),
                        allowedProps,
                    ),
                ),
                to: map(toArray(tweens.to), (props) =>
                    pick(
                        mapValues(props, (value, tween) =>
                            transformProps.indexOf(tween) !== -1 ? Rematrix[tween](value) : value,
                        ),
                        allowedProps,
                    ),
                ),
            };
        });

        const tweenDefaultConfig = pick(this.config, overridableConfig);
        const styles = map(keys(this.config.tweens), (tween) => {
            const fromTweens = reduce(
                map(matrices[tween].from, (tweens) => merge({}, tweens)),
                merge,
            );
            const toTweens = reduce(
                map(matrices[tween].to, (tweens) => merge({}, tweens)),
                merge,
            );

            let fromTransformMatrix = [];
            map(matrices[tween].from, (tweens) => {
                fromTransformMatrix = fromTransformMatrix.concat(values(pick(tweens, transformProps)));
            });

            let toTransformMatrix = [];
            map(matrices[tween].to, (tweens) => {
                toTransformMatrix = toTransformMatrix.concat(values(pick(tweens, transformProps)));
            });

            const tweenConfig = pick(this.config.tweens[tween], overridableConfig);

            this.transforms[tween] = {
                from: fromTransformMatrix.length === 0 ? null : fromTransformMatrix.reduce(Rematrix.multiply),
                to: toTransformMatrix.length === 0 ? null : toTransformMatrix.reduce(Rematrix.multiply),
            };

            return `[data-${this.config.data}="${tween}"]:not(.${this.animatedClass}) { ${toStyle(
                mapValues(
                    merge(
                        isEqual(tweenConfig, tweenDefaultConfig) === true
                            ? {}
                            : {
                                  'transform-origin': `${tweenConfig.origin}`,
                                  transition: `all ${tweenConfig.duration}ms ${tweenConfig.function}`,
                              },
                        pick(fromTweens, cssProps),
                        fromTransformMatrix.length === 0
                            ? {}
                            : {
                                  transform: `${Rematrix.toString(this.transforms[tween].from)}`,
                              },
                    ),
                    (value) => `${value} !important`,
                ),
            )} } [data-${this.config.data}="${tween}"].${this.animateClass} { ${toStyle(
                mapValues(
                    merge(
                        {},
                        pick(toTweens, cssProps),
                        toTransformMatrix.length === 0
                            ? {}
                            : {
                                  transform: `${Rematrix.toString(this.transforms[tween].to)}`,
                              },
                    ),
                    (value) => `${value} !important`,
                ),
            )} }`;
        });

        styles.push(`
			[data-${this.config.data}].${this.readyClass} {
				pointer-events: none !important;
				will-change: opacity, transform !important;
				transform-origin: ${tweenDefaultConfig.origin};
				transition: all ${tweenDefaultConfig.duration}ms ${tweenDefaultConfig.function};
			}`);

        addStyle(styles.join(' '));

        this.onDOMInserted();

        this.onScroll = ::this.onScroll;
        this.onScrollThrottle = throttle(this.onScroll);

        this.onDOMInserted = ::this.onDOMInserted;
        this.onDOMInsertedThrottle = throttle(this.onDOMInserted);

        this.config.container.addEventListener('scroll', this.onScrollThrottle, {
            capture: true,
            passive: true,
        });
        this.config.container.addEventListener('DOMNodeInserted', this.onDOMInsertedThrottle, {
            capture: true,
            passive: true,
        });
    }

    destroy = () => {
        this.config.container.removeEventListener('scroll', this.onScrollThrottle, {
            capture: true,
            passive: true,
        });
        this.config.container.removeEventListener('DOMNodeInserted', this.onDOMInsertedThrottle, {
            capture: true,
            passive: true,
        });

        this.destroyElements();
    };

    destroyElements = (elements) => {
        map(this.getElements(elements), (el) => {
            el.style.transitionDelay = null;

            el.classList.remove(this.readyClass);
            el.classList.remove(this.animateClass);
            el.classList.remove(this.animatedClass);
        });

        this.elementsToCheck = [];
    };

    resetElements = (elements) => {
        this.destroyElements(elements);

        if (this.isMobile === false) this.handleDOMInserted();
    };

    getElements = (targets) => {
        if (targets === null || targets === undefined) {
            targets = this.containerEl.querySelectorAll(`[data-${this.config.data}]`);
        } else if (typeof targets === 'string') {
            targets = this.containerEl.querySelectorAll(targets);
        }

        return targets;
    };

    getAnimatableElements = () => {
        return this.getElements(`[data-${this.config.data}]:not(.${this.animateClass}):not(.${this.animatedClass})`);
    };

    getElementData = (el, data = '', modifier = (v) => v) => {
        return modifier(el.dataset[`${this.config.data}${pascalCase(data)}`]);
    };

    getElementTween = (el) => {
        const tween = this.getElementData(el, '', (v) => v);

        return this.transforms[tween] ? tween : this.config.animation;
    };

    getElementOffset = (el, defaultValue = 0) => {
        return this.getElementData(el, 'offset', (v) => Number(v) || defaultValue);
    };

    getElementDelay = (el, defaultValue = 0) => {
        return this.getElementData(el, 'delay', (v) => Number(v) || defaultValue);
    };

    animateElements = () => {
        if (this.isAnimating === true) return;

        this.isAnimating = true;

        fastdom.mutate(() => {
            const autoDelay = Math.ceil(
                (this.config.autoDelay || 0) - Math.max(0, this.elementsToAnimate.length / this.config.autoDelayRatio),
            );

            map(this.elementsToAnimate, (el) => {
                let delay = this.getElementDelay(el) || this.config.delay;

                if (this.index !== 0) delay += this.index * autoDelay;

                el.style.transitionDelay = `${delay}ms`;

                el.addEventListener(
                    'transitionend',
                    () => {
                        el.classList.add(this.animatedClass);
                        el.classList.remove(this.readyClass);

                        fastdom.mutate(() => el.classList.remove(this.animateClass));

                        el.style.transitionDelay = null;
                    },
                    false,
                );

                el.classList.add(this.readyClass);
                el.classList.add(this.animateClass);

                this.index += 1;

                clearTimeout(this.debounceIndex);

                this.debounceIndex = setTimeout(() => {
                    this.index = 0;
                }, this.config.scrollReset);

                this.elementsToAnimate.unshift();
            });

            this.isAnimating = false;
            this.elementsToAnimate = [];
        });
    };

    onScroll = () => {
        nextTick(this.handleScroll);

        fastdom.measure(() => {
            const scrollY = this.config.container.scrollY;

            if (scrollY - this.lastScrollY > this.config.scrollReset) this.index = 0;

            this.lastScrollY = scrollY;
        });
    };

    handleScroll = () => {
        if (this.isMeasuring === true) return;

        this.isMeasuring = true;

        fastdom.measure(() => {
            this.elementsToCheck = filter(
                map(this.elementsToCheck, (el) => {
                    const tween = this.getElementTween(el);

                    if (
                        inViewport(el, {
                            top:
                                this.getElementOffset(el, this.config.tweens[tween].offset) -
                                ((this.transforms[tween].from && this.transforms[tween].from[13]) || 0),
                        }) === false
                    )
                        return el;
                    else this.elementsToAnimate.push(el);
                }),
            );

            this.isMeasuring = false;
            this.animateElements();
        });
    };

    onDOMInserted = () => {
        clearTimeout(this.debounceInserted);
        this.debounceInserted = setTimeout(() => this.handleDOMInserted(), 20);
    };

    handleDOMInserted = () => {
        fastdom.measure(() => {
            this.elementsToCheck = [];

            const elements = this.getAnimatableElements();

            fastdom.mutate(() => {
                map(elements, (el) => el.classList.add(this.readyClass));

                nextTick(() => {
                    this.elementsToCheck = [...elements];
                    this.handleScroll();
                });
            });
        });
    };
}

export default ScrolloPluginLib;
