'use strict';

/**
 * @name IntervalHOCLib
 * @description Interval HOC for ReactJS personal library
 * @file ReactJS Interval HOC
 *
 * @version 1.1.1 - 2019-11-29
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import noop from 'lodash/noop';

export default (Component) => {
    class IntervalHOCLib extends React.Component {
        handleRender(props) {
            return <Component {...this.props} interval={props} />;
        }

        render() {
            return <IntervalHOCComponentLib render={::this.handleRender} />;
        }
    }

    return IntervalHOCLib;
};

class IntervalHOCComponentLib extends React.Component {
    static propTypes = {
        render: PropTypes.func,
    };

    static defaultProps = {
        render: noop,
    };

    intervals = {};

    componentWillUnmount() {
        this.clearAll();
    }

    set(cb, interval, oldIntervalId = null) {
        if (oldIntervalId !== null) this.clear(oldIntervalId);

        const intervalId = setInterval(() => {
            this.clear(intervalId);
            cb();
        }, interval);

        this.intervals[intervalId] = intervalId;

        return intervalId;
    }

    clear(intervalId) {
        if (this.intervals[intervalId] === undefined) return;

        delete this.intervals[intervalId];

        clearInterval(intervalId);
    }

    clearAll() {
        map(this.intervals, (intervalId) => this.clear(intervalId));
    }

    render() {
        return this.props.render({
            set: ::this.set,
            clear: ::this.clear,
            clearAll: ::this.clearAll,
        });
    }
}
