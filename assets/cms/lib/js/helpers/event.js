'use strict';

/**
 * @name EventHelperLib
 * @description Event helper for ReactJS personal library
 * @file ReactJS Event helper
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import EventEmitter from 'eventemitter3';

import map from 'lodash/map';

const EventHelperLib = new EventEmitter();

EventHelperLib.bindMany = (events, context, prepend = '') => {
    map(events, (eventCallback, eventName) => EventHelperLib.on(`${prepend}${eventName}`, eventCallback, context));
};

EventHelperLib.unbindMany = (events, context, prepend = '') => {
    map(events, (eventCallback, eventName) => EventHelperLib.off(`${prepend}${eventName}`, eventCallback, context));
};

export default EventHelperLib;
