'use strict';

/**
 * @name ObjectHelperLib
 * @description Object helper for ReactJS personal library
 * @file ReactJS Object helper
 *
 * @version 1.1.2 - 2019-07-29
 * @author Alexandre Pilloud
 */

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import setWith from 'lodash/setWith';
import unset from 'lodash/unset';

import getSet from 'lib/js/utils/getSet';
import getSetWith from 'lib/js/utils/getSetWith';

class ObjectHelperLib {
    __data = {};

    constructor(data = {}) {
        this.reset(data);
    }

    reset(data = {}) {
        this.__data = cloneDeep(data);
    }

    set(path, value) {
        set(this.__data, path, value);

        return this.get(path);
    }

    setWith(path, value, type = Object) {
        setWith(this.__data, path, value, type);

        return this.get(path);
    }

    get(path, defaultValue = undefined) {
        return path === undefined ? this.__data : get(this.__data, path, defaultValue);
    }

    getSet(path, defaultValue = undefined) {
        return path === undefined ? this.__data : getSet(this.__data, path, defaultValue);
    }

    getSetWith(path, defaultValue = undefined, type = Object) {
        return path === undefined ? this.__data : getSetWith(this.__data, path, defaultValue, type);
    }

    has(path) {
        return has(this.__data, path);
    }

    unset(path) {
        return unset(this.__data, path);
    }

    debug(path) {
        console.log(this.get(path));
    }
}

export default ObjectHelperLib;
