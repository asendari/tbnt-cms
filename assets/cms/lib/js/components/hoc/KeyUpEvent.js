'use strict';

/**
 * @name KeyUpEventHOCLib
 * @description Key Up Event HOC for ReactJS personal library
 * @file ReactJS Key Up Event HOC
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

const defaultThrottle = 10;

export default (Component) => {
    class KeyUpEventHOCLib extends React.Component {
        handleRender(props) {
            return <Component {...this.props} keyUpEvent={props} />;
        }

        render() {
            return <KeyUpEventHOCComponentLib render={::this.handleRender} />;
        }
    }

    return KeyUpEventHOCLib;
};

class KeyUpEventHOCComponentLib extends React.Component {
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
        const eventCb = ({ keyCode, ctrlKey, altKey, shiftKey, metaKey }) =>
            nextTick(() =>
                call(cb, keyCode, keysMap[keyCode] ?? null, {
                    ctrl: ctrlKey,
                    alt: altKey,
                    shift: shiftKey,
                    os: metaKey,
                }),
            );

        const throttleTimeout = [true, undefined].indexOf(options.throttle) === -1 ? options.throttle : defaultThrottle;

        this.events[eventId] = {
            cb: throttleTimeout !== false ? throttle(eventCb, throttleTimeout) : eventCb,
            listener: options.listener ?? document,
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
        if (event !== undefined) event.listener.addEventListener('keyup', event.cb, { capture: true, passive: true });
    }

    stop(eventId) {
        const event = this.events[eventId];

        if (event !== undefined) event.listener.removeEventListener('keyup', event.cb, { capture: true, passive: true });
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

const keysMap = {
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'control',
    18: 'alt',
    20: 'caps_lock',
    27: 'esc',
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
    91: 'os',
    96: 'numpad0',
    97: 'numpad1',
    98: 'numpad2',
    99: 'numpad3',
    100: 'numpad4',
    101: 'numpad5',
    102: 'numpad6',
    103: 'numpad7',
    104: 'numpad8',
    105: 'numpad9',
};
