'use strict';

/**
 * @name FastdomHOCLib
 * @description Fastdom HOC for ReactJS personal library
 * @file ReactJS Fastdom HOC
 *
 * @version 1.1.1 - 2019-11-29
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';
import fastdom from 'fastdom';

import map from 'lodash/map';
import noop from 'lodash/noop';

export default (Component) => {
    class FastdomHOCLib extends React.Component {
        handleRender(props) {
            return <Component {...this.props} fastdom={props} />;
        }

        render() {
            return <FastdomHOCComponentLib render={::this.handleRender} />;
        }
    }

    return FastdomHOCLib;
};

class FastdomHOCComponentLib extends React.Component {
    static propTypes = {
        render: PropTypes.func,
    };

    static defaultProps = {
        render: noop,
    };

    timeouts = {};

    componentWillUnmount() {
        this.clearAll();
    }

    measure(cb, oldTimeoutId = null) {
        if (oldTimeoutId !== null) this.clear(oldTimeoutId);

        const timeoutId = fastdom.measure(() => {
            this.clear(timeoutId);
            cb();
        });

        this.timeouts[timeoutId] = timeoutId;

        return timeoutId;
    }

    mutate(cb, oldTimeoutId = null) {
        if (oldTimeoutId !== null) this.clear(oldTimeoutId);

        const timeoutId = fastdom.mutate(() => {
            this.clear(timeoutId);
            cb();
        });

        this.timeouts[timeoutId] = timeoutId;

        return timeoutId;
    }

    clear(timeoutId) {
        if (this.timeouts[timeoutId] === undefined) return;

        delete this.timeouts[timeoutId];

        fastdom.clear(timeoutId);
    }

    clearAll() {
        map(this.timeouts, (timeoutId) => this.clear(timeoutId));
    }

    render() {
        return this.props.render({
            measure: ::this.measure,
            mutate: ::this.mutate,
            clear: ::this.clear,
            clearAll: ::this.clearAll,
        });
    }
}
