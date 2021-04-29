'use strict';

/**
 * @name StatuxHelperLib
 * @description Statux helper for ReactJS personal library
 * @file ReactJS Statux helper
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import keys from 'lodash/keys';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import set from 'lodash/set';

import isObject from 'lib/js/utils/isObject';
import nextTick from 'lib/js/utils/nextTick';

import ev from './event';

let state = {};

const events = {
    UPDATE: 'statux:update',
};

class StatuxHelperLib {
    constructor(defaultState) {
        state = merge({}, defaultState);
    }

    set(path, value) {
        if (isObject(path) === true) {
            if (isEqual(path, pick(state, keys(path))) === true) return;
            merge(state, path);
        } else {
            if (isEqual(this.get(path), value) === true) return;
            set(state, path, value);
        }

        nextTick(() => ev.emit(events.UPDATE, merge({}, state)));
    }

    get(path, defaultValue) {
        if (path === undefined) return merge({}, state);
        else return get(state, path, defaultValue);
    }
}

export default StatuxHelperLib;
export { events };
