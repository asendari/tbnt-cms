'use strict';

/**
 * @name FormHelperLib
 * @description Form helper for ReactJS personal library
 * @file ReactJS Form helper
 *
 * @version 1.1.2 - 2019-12-18
 * @author Alexandre Pilloud
 */

import filter from 'lodash/filter';
import get from 'lodash/get';
import keys from 'lodash/keys';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';
import setWith from 'lodash/setWith';
import trim from 'lodash/trim';

import call from 'lib/js/utils/call';
import isArray from 'lib/js/utils/isArray';
import toArray from 'lib/js/utils/toArray';

class FormHelperLib {
    constructor(context = {}, dataState = '', options = {}) {
        this.inputs = {};
        this.options = options;

        this.context = context;
        this.dataState = dataState;
        this.dataAdditional = {};
    }

    getState(path, defaultValue = null) {
        return get(this.context, path ? `state.${this.dataState}.${path}` : '', defaultValue);
    }

    setInputs(inputs = {}) {
        this.inputs = inputs;
    }

    addInput(name, input) {
        this.addInputs({ [name]: input });
    }

    addInputs(inputs = {}) {
        this.inputs = merge(this.inputs, inputs);
    }

    removeInput(name) {
        delete this.inputs[name];
    }

    removeInputs(names = []) {
        this.inputs = omit(this.inputs, names);
    }

    addAdditionalValue(name, value) {
        this.addAdditionalValues({ [name]: value });
    }

    addAdditionalValues(values) {
        this.dataAdditional = merge(this.dataAdditional, values);
    }

    getAdditionalValue(name) {
        return this.dataAdditional[name];
    }

    resetValues() {
        map(this.inputs, (input, name) => this.resetValue(name));
    }

    resetValue(name, cb) {
        this.inputs[name]?.resetInputValue(cb);
    }

    setValue(name, value, cb) {
        this.inputs[name]?.setInputValue(value, cb);
    }

    setValueLoader(name, loader = true) {
        this.inputs[name]?.setLoader(loader);
    }

    setValueSuccess(name, success = true) {
        this.inputs[name]?.setSuccess(success);
    }

    setValueError(name, error = true) {
        this.inputs[name]?.setError(error);
    }

    getSubmitableValue(name, defaultValue = '') {
        return this.inputs[name]?.getSubmitableValue(defaultValue) ?? defaultValue;
    }

    getValue(name, defaultValue = '') {
        return this.inputs[name]?.getInputValue(defaultValue) ?? defaultValue;
    }

    getValues() {
        return merge(
            {},
            this.dataAdditional,
            reduce(
                map(this.inputs, (input, name) => ({ [name]: this.getValue(name) })),
                (result, value) => merge(result || {}, value),
            ),
        );
    }

    getValuesObject() {
        return reduce(this.getValues(), (result, value, key) => setWith(result, key, value, Object), {});
    }

    getUpdatableValues() {
        return (
            reduce(
                map(this.getUpdatablesNames(), (name) => ({ [name]: this.getValue(name) })),
                (result, value) => merge(result || {}, value),
            ) || {}
        );
    }

    getUpdatablesNames() {
        return filter(map(this.inputs, (input, name) => input.isUpdatable() && name));
    }

    getUpdatablesInputs() {
        return filter(map(this.inputs, (input, name) => input.isUpdatable() && input));
    }

    getFormattedName(name) {
        return map(name.split('.'), (fragment, index) => (index === 0 ? fragment : `[${fragment}]`)).join('');
    }

    isUpdatable() {
        return filter(map(this.inputs, (input, name) => input.isUpdatable())).length !== 0;
    }

    isFilled(data) {
        data = (data || null) === null ? null : toArray(data);

        return (
            filter(this.getValues(), (value, key) => (data === null || data.indexOf(key) !== -1) && trim(value) === '').length ===
            0
        );
    }

    setUpdating(data) {
        data = data || [];

        map(isArray(data) ? data : keys(data), (name) => this.setValueLoader(this.getFormattedName(name), true));

        this.emit('update', data);
    }

    resetUpdating(data) {
        data = data || this.getState();

        map(isArray(data) ? data : keys(data), (name) => this.setValueLoader(this.getFormattedName(name), false));

        this.emit('update', data);
    }

    setSuccess(data) {
        data = data || [];

        map(isArray(data) ? data : keys(data), (name) => this.setValueSuccess(this.getFormattedName(name), true));

        this.emit('success', data);
    }

    resetSuccess(data) {
        data = data || this.getState();

        map(isArray(data) ? data : keys(data), (name) => this.setValueSuccess(this.getFormattedName(name), false));

        this.emit('success', data);
    }

    setErrors(data) {
        data = data || {};

        map(
            mapValues(data, (errors) => errors.join('\n')),
            (error, name) => this.setValueError(this.getFormattedName(name), error),
        );

        this.emit('errors', data);
    }

    resetErrors(data) {
        data = data || this.getState();

        map(isArray(data) ? data : keys(data), (name) => this.setValueError(this.getFormattedName(name), false));

        this.emit('errors', data);
    }

    emit(state, ...args) {
        call(this.options[state], ...args);
        call(this.options.onChange, state, ...args);
    }
}

export default FormHelperLib;
