'use strict';

/**
 * @name TimeoutHOCLib
 * @description Timeout HOC for ReactJS personal library
 * @file ReactJS Timeout HOC
 *
 * @version 1.1.1 - 2019-11-29
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import noop from 'lodash/noop';

import nextTick from 'lib/js/utils/nextTick';

export default (Component) => {
    class TimeoutHOCLib extends React.Component {
        handleRender(props) {
            return <Component {...this.props} timeout={props} />;
        }

        render() {
            return <TimeoutHOCComponentLib render={::this.handleRender} />;
        }
    }

    return TimeoutHOCLib;
};

class TimeoutHOCComponentLib extends React.Component {
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

    set(cb, timeout, oldTimeoutId = null) {
        if (oldTimeoutId !== null) this.clear(oldTimeoutId);

        const timeoutId = setTimeout(() => {
            this.clear(timeoutId);
            nextTick(cb);
        }, timeout);

        this.timeouts[timeoutId] = timeoutId;

        return timeoutId;
    }

    clear(timeoutId) {
        if (this.timeouts[timeoutId] === undefined) return;

        delete this.timeouts[timeoutId];

        clearTimeout(timeoutId);
    }

    clearAll() {
        map(this.timeouts, (timeoutId) => this.clear(timeoutId));
    }

    render() {
        return this.props.render({
            set: ::this.set,
            clear: ::this.clear,
            clearAll: ::this.clearAll,
        });
    }
}
