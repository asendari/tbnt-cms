'use strict';

/**
 * @name BaseInputBaseComponentLib
 * @description Base Input base component for ReactJS personal library
 * @file ReactJS Base Input Component
 *
 * @version 1.1.3 - 2020-08-24
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import keys from 'lodash/keys';
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import omit from 'lodash/omit';

import call from 'lib/js/utils/call';

class BaseInputBaseComponentLib extends React.PureComponent {
    static _getPropTypes(props) {
        return merge(
            {
                onRef: PropTypes.func,
                onChange: PropTypes.func,
                onUpdate: PropTypes.func,
                name: PropTypes.string,
                initialValue: PropTypes.any,
                value: PropTypes.any,
                disabled: PropTypes.bool,
            },
            props,
        );
    }

    static _getDefaultProps(props) {
        return merge(
            {
                onRef: noop,
                onChange: noop,
                onUpdate: noop,
                name: null,
                initialValue: null,
                value: null,
                disabled: false,
            },
            props,
        );
    }

    _removeProps(props) {
        return omit(props, keys(this.constructor._getPropTypes()));
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentDidUpdate(oldProps) {
        if (isEqual(oldProps.value, this.props.value) === false) {
            this.setValue(this.props.value);
        } else if (isEqual(oldProps.initialValue, this.props.initialValue) === false) {
            this.setValue(this.props.initialValue);
        }
    }

    isUpdatable() {
        return isEqual(this.getValue(), this.formatValue(this.props.initialValue)) === false;
    }

    static formatValue(value, props) {
        return value;
    }

    formatValue(value) {
        return this.constructor.formatValue(value, this.props);
    }

    resetValue(cb) {
        this.setValue(this.props.initialValue, cb);
    }

    setValue(value, cb) {
        this.setState({ value: this.formatValue(value) }, () => {
            this.emitUpdate();
            call(cb);
        });
    }

    getValue(defaultValue = '') {
        return this.state.value ?? defaultValue;
    }

    getPropsValue() {
        return this.props[this.getPropsValueKey()];
    }

    getPropsValueKey() {
        return this.props.value !== null ? 'value' : 'initialValue';
    }

    focus() {
        return this.$input?.focus?.();
    }

    blur() {
        return this.$input?.blur?.();
    }

    emitUpdate() {
        this.props.onUpdate?.(this.getValue());
    }

    handleInputRef(ref) {
        this.$input = ref;
    }
}

export default BaseInputBaseComponentLib;
