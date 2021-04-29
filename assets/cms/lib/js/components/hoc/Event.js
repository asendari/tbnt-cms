'use strict';

/**
 * @name EventHOCLib
 * @description Event HOC for ReactJS personal library
 * @file ReactJS Event HOC
 *
 * @version 1.0.1 - 2019-11-29
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import noop from 'lodash/noop';

import call from 'lib/js/utils/call';
import nextTick from 'lib/js/utils/nextTick';

import ev from 'lib/js/helpers/event';

export default (Component) => {
    class EventHOCLib extends React.Component {
        handleRender(props) {
            return <Component {...this.props} event={props} />;
        }

        render() {
            return <EventHOCComponentLib render={::this.handleRender} />;
        }
    }

    return EventHOCLib;
};

class EventHOCComponentLib extends React.Component {
    static propTypes = {
        render: PropTypes.func,
    };

    static defaultProps = {
        render: noop,
    };

    events = {};

    componentWillUnmount() {
        this.removeAll();
    }

    add(name, cb) {
        const eventCb = (...args) => nextTick(() => call(cb, ...args));

        this.events[name] = {
            cb: eventCb,
        };

        this.stop(name);
        this.start(name);

        return {
            id: name,
            start: () => this.start(name),
            stop: () => this.stop(name),
            remove: () => this.remove(name),
        };
    }

    start(name) {
        const event = this.events[name];
        if (event !== undefined) ev.on(name, event.cb);
    }

    stop(name) {
        const event = this.events[name];
        if (event !== undefined) ev.off(name, event.cb);
    }

    remove(name) {
        this.stop(name);
        delete this.events[name];
    }

    removeAll() {
        map(this.events, (listener, name) => this.remove(name));
    }

    emit(...args) {
        ev.emit(...args);
    }

    render() {
        return this.props.render({
            add: ::this.add,
            remove: ::this.remove,
            removeAll: ::this.removeAll,
            emit: ::this.emit,
        });
    }
}
