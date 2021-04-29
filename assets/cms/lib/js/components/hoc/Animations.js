'use strict';

/**
 * @name AnimationsHOCLib
 * @description Animations HOC for ReactJS personal library
 * @file ReactJS Animations HOC
 *
 * @version 1.1.1 - 2019-11-29
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import dropRight from 'lodash/dropRight';
import isPlainObject from 'lodash/isPlainObject';
import last from 'lodash/last';
import map from 'lodash/map';
import merge from 'lodash/merge';
import noop from 'lodash/noop';

import call from 'lib/js/utils/call';

export default (Component, animations) => {
    class AnimationsHOCLib extends React.Component {
        handleRender(props) {
            return <Component {...this.props} animations={props} />;
        }

        render() {
            return <AnimationsHOCComponentLib animations={animations} render={::this.handleRender} />;
        }
    }

    return AnimationsHOCLib;
};

class AnimationsHOCComponentLib extends React.Component {
    static propTypes = {
        render: PropTypes.func,
        animations: PropTypes.object.isRequired,
    };

    static defaultProps = {
        render: noop,
    };

    tweens = {};

    componentWillUnmount() {
        this.clearAll();
    }

    call(name, ...args) {
        const hasOptions = isPlainObject(last(args));
        const options = hasOptions === true ? last(args) : {};

        if ((options.oldAnimation ?? null) !== null) this.clear(options.oldAnimation);

        const tween = this.props.animations[name](
            ...(hasOptions === true ? dropRight(args) : args),
            merge({}, options, {
                onComplete: (...args) => {
                    this.clear(tween);
                    call(options.onComplete, ...args);
                },
            }),
        );

        this.tweens[tween] = tween;

        return tween;
    }

    clear(tween) {
        delete this.tweens[tween];

        tween?.kill?.();
    }

    clearAll() {
        map(this.tweens, (tween) => this.clear(tween));
    }

    render() {
        const functions = {};

        map(this.props.animations, (func, name) => {
            functions[name] = (...args) => this.call(name, ...args);
        });

        return this.props.render({
            ...functions,
            clear: ::this.clear,
            clearAll: ::this.clearAll,
        });
    }
}
