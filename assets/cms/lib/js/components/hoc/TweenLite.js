'use strict';

/**
 * @name TweenLiteHOCLib
 * @description TweenLite HOC for ReactJS personal library
 * @file ReactJS TweenLite HOC
 *
 * @version 1.1.1 - 2019-11-29
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import merge from 'lodash/merge';
import noop from 'lodash/noop';

import call from 'lib/js/utils/call';

import 'lib/js/helpers/gsap';

export default (Component) => {
    class TweenLiteHOCLib extends React.Component {
        handleRender(props) {
            return <Component {...this.props} tween={props} />;
        }

        render() {
            return <TweenLiteHOCComponentLib render={::this.handleRender} />;
        }
    }

    return TweenLiteHOCLib;
};

class TweenLiteHOCComponentLib extends React.Component {
    static propTypes = {
        render: PropTypes.func,
    };

    static defaultProps = {
        render: noop,
    };

    tweens = {};

    componentWillUnmount() {
        this.clearAll();
    }

    set(el, props, oldTween = null) {
        return this.to(el, 0, props, oldTween);
    }

    to(el, duration, props, oldTween = null) {
        if (oldTween !== null) this.clear(oldTween);

        const tween = TweenLite.to(
            el,
            duration,
            merge({}, props, {
                onComplete: (...args) => {
                    this.clear(tween);
                    call(props.onComplete, ...args);
                },
            }),
        );

        this.tweens[tween] = tween;

        return tween;
    }

    from(el, duration, props, oldTween = null) {
        if (oldTween !== null) this.clear(oldTween);

        const tween = TweenLite.from(
            el,
            duration,
            merge({}, props, {
                onComplete: (...args) => {
                    this.clear(tween);
                    call(props.onComplete, ...args);
                },
            }),
        );

        this.tweens[tween] = tween;

        return tween;
    }

    fromTo(el, duration, fromProps, toProps, oldTween = null) {
        if (oldTween !== null) this.clear(oldTween);

        const tween = TweenLite.fromTo(
            el,
            duration,
            fromProps,
            merge({}, toProps, {
                onComplete: (...args) => {
                    this.clear(tween);
                    call(toProps.onComplete, ...args);
                },
            }),
        );

        this.tweens[tween] = tween;

        return tween;
    }

    clear(tween) {
        delete this.tweens[tween];

        tween?.kill();
    }

    clearAll() {
        map(this.tweens, (tween) => this.clear(tween));
    }

    render() {
        return this.props.render({
            set: ::this.set,
            to: ::this.to,
            from: ::this.from,
            fromTo: ::this.fromTo,
            clear: ::this.clear,
            clearAll: ::this.clearAll,
        });
    }
}
