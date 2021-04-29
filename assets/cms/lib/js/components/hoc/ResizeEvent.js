'use strict';

/**
 * @name ResizeEventHOCLib
 * @description Resize Event HOC for ReactJS personal library
 * @file ReactJS Resize Event HOC
 *
 * @version 1.1.1 - 2019-11-29
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import noop from 'lodash/noop';
import throttle from 'lodash/throttle';

import call from 'lib/js/utils/call';
import nextTick from 'lib/js/utils/nextTick';
import uniqId from 'lib/js/utils/uniqId';

import withFastdom from 'lib/js/components/hoc/Fastdom';

const defaultThrottle = 10;

export default (Component) => {
    class ResizeEventHOCLib extends React.Component {
        handleRender(props) {
            return <Component {...this.props} resizeEvent={props} />;
        }

        render() {
            return <ResizeEventHOCComponentLib render={::this.handleRender} />;
        }
    }

    return ResizeEventHOCLib;
};

class ResizeEventHOCComponentLib extends React.Component {
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

    add(cb, options = {}) {
        const eventId = uniqId();
        const eventCb = () =>
            nextTick(() =>
                this.events[eventId].listener === null
                    ? call(cb)
                    : this.props.fastdom.measure(() => {
                          let rect = null;
                          try {
                              rect = this.events[eventId].listener.getBoundingClientRect();
                          } catch (e) {}
                          call(cb, rect ?? null);
                      }),
            );

        const throttleTimeout = [true, undefined].indexOf(options.throttle) === -1 ? options.throttle : defaultThrottle;

        this.events[eventId] = {
            cb: throttleTimeout !== false ? throttle(eventCb, throttleTimeout) : eventCb,
            listener: options.listener ?? null,
            throttle: throttleTimeout,
        };

        this.start(eventId);

        return {
            id: eventId,
            start: () => this.start(eventId),
            stop: () => this.stop(eventId),
            remove: () => this.remove(eventId),
        };
    }

    start(eventId) {
        const event = this.events[eventId];
        if (event !== undefined) window.addEventListener('resize', event.cb, { capture: true, passive: true });
    }

    stop(eventId) {
        const event = this.events[eventId];
        if (event !== undefined) window.removeEventListener('resize', event.cb, { capture: true, passive: true });
    }

    remove(eventId) {
        this.stop(eventId);

        delete this.events[eventId];
    }

    removeAll() {
        map(this.events, (listener, eventId) => this.remove(eventId));
    }

    render() {
        return this.props.render({
            add: ::this.add,
            start: ::this.start,
            stop: ::this.stop,
            remove: ::this.remove,
            removeAll: ::this.removeAll,
        });
    }
}

ResizeEventHOCComponentLib = withFastdom(ResizeEventHOCComponentLib);
