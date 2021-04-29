'use strict';

/**
 * @name ParallaxPluginLib
 * @description Parallax Plugin for ReactJS personal library
 * @file ReactJS Parallax Plugin
 *
 * @version 1.1.1 - 2019-08-06
 * @author Alexandre Pilloud
 */

import { Easer } from 'functional-easing';
import { scaleLinear } from 'd3-scale';
import fastdom from 'fastdom';
import * as Rematrix from 'rematrix';

import get from 'lodash/get';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import max from 'lodash/max';
import merge from 'lodash/merge';
import min from 'lodash/min';
import pick from 'lodash/pick';
import throttle from 'lodash/throttle';
import { default as _values } from 'lodash/values';

import forceNumber from 'lib/js/utils/forceNumber';
import getStaticElementPos from 'lib/js/utils/getStaticElementPos';
import setCss from 'lib/js/utils/setCss';

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

const availableProps = [...cssProps, ...transformProps];

const defaultUnits = {};

const defaultConfig = {
    container: window,
    mobile: false,
    ratio: 0,
    duration: 100,
    function: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
    ease: 'linear',
    timeline: {},
    units: {},
};

class ParallaxPluginLib {
    constructor(config = {}) {
        this.config = merge({}, defaultConfig, config);
        this.units = merge({}, defaultUnits, this.config.units);

        this.$parallax = this.config.target;

        if (this.$parallax === null || (this.config.mobile === false && this.isMobile === true)) return;

        this.$parallax.style.willChange = 'transform';
        this.$parallax.style.pointerEvents = 'none';
        this.$parallax.style.transition = `all ${this.config.duration}ms ${this.config.function}`;

        this.inputRange = {};
        this.outputRange = {};
        this.interpolated = {};

        this.fastdomRef = null;

        this.initTimeline();

        this.handleScroll();

        this.handleScroll = ::this.handleScroll;
        this.handleScrollThrottle = throttle(this.handleScroll);

        this.config.container.addEventListener('scroll', this.handleScrollThrottle, {
            capture: true,
            passive: true,
        });
    }

    destroy() {
        fastdom.clear(this.fastdomRef);

        this.config.container.removeEventListener('scroll', this.handleScrollThrottle, {
            capture: true,
            passive: true,
        });
    }

    initTimeline() {
        const indexes = map(this.config.timeline, (v, k) => Number(k));

        map(this.config.timeline, (tl, s) =>
            map(tl, (v, at) => {
                if (this.outputRange[at] === undefined) this.outputRange[at] = {};

                this.outputRange[at][s] = v;
            }),
        );

        this.outputRange = mapValues(this.outputRange, (oR, at) => {
            const keys = map(oR, (v, k) => Number(k));
            const keyMin = Math.min(...keys);
            const keyMax = Math.max(...keys);

            indexes.slice(0, indexes.indexOf(keyMin)).map((missingIndex) => {
                oR[missingIndex] = oR[keyMin];
            });
            indexes.slice(indexes.indexOf(keyMax) + 1).map((missingIndex) => {
                oR[missingIndex] = oR[keyMax];
            });

            return oR;
        });

        this.outputRange = mapValues(this.outputRange, (or, at) => {
            this.inputRange[at] = map(or, (tl, s) => forceNumber(s));

            return _values(or);
        });

        this.inputRange = mapValues(this.inputRange, (ir, at) => {
            const interpolated = scaleLinear()
                .domain([min(ir), max(ir)])
                .range([0, 1]);

            return map(ir, (tl, s) => interpolated(tl));
        });

        this.interpolated = mapValues(this.outputRange, (or, at) => scaleLinear().domain(this.inputRange[at]).range(or));
    }

    handleScroll() {
        this.fastdomRef = fastdom.measure(() => {
            if (this.$parallax === null) return;

            const height = this.$parallax.offsetHeight;
            const boundary = Math.abs(height * this.config.ratio);
            const position = getStaticElementPos(this.$parallax);

            const windowHeight = this.config.container.innerHeight;
            const windowYScroll = this.config.container.pageYOffset;

            if (
                position.top - boundary < windowYScroll + windowHeight &&
                position.top + height + boundary > windowYScroll === false
            )
                return;

            const halfWindowheight = windowHeight / 2;

            const middleElLine = position.top + height / 2;
            const middleScrollLine = windowYScroll + halfWindowheight;

            const difference = middleElLine - middleScrollLine;
            const easer = new Easer().using(this.config.ease);

            const ratio = difference / (halfWindowheight + boundary + height);
            const ratioEase = easer(ratio);

            const ratioRange = 1 - (difference / halfWindowheight / 2 + 0.5);
            const ratioRangeEase = easer(ratioRange);

            const values = mapValues(this.interpolated, (value, tween) => {
                value = value(ratioRangeEase);

                if (transformProps.indexOf(tween) !== -1) return Rematrix[tween](value);

                return `${value}${get(this.units, tween, '')}`;
            });

            const tweenTransform = pick(values, transformProps);
            const tweenValues = merge({}, pick(tweenValues, cssProps), {
                transform: Rematrix.toString(
                    [Rematrix.translateY(height * this.config.ratio * ratioEase)]
                        .concat(_values(tweenTransform))
                        .reduce(Rematrix.multiply),
                ),
            });

            this.fastdomRef = fastdom.mutate(() => this.$parallax !== null && setCss(this.$parallax, tweenValues));
        });
    }
}

export default ParallaxPluginLib;
