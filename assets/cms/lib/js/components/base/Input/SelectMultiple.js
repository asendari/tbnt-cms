'use strict';

/**
 * @name SelectMultipleInputBaseComponentLib
 * @description SelectMultiple Input base component for ReactJS personal library
 * @file ReactJS SelectMultiple Input Component
 *
 * @version 1.2.5 - 2020-10-05
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';
import Select, { Async } from 'react-select-virtualized'; // <-- PLEASE REPLACE THIS SHITTY COMPONENT!!!

import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import find from 'lodash/find';
import head from 'lodash/head';
import intersection from 'lodash/intersection';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import merge from 'lodash/merge';
import noop from 'lodash/noop';

import toArray from 'lib/js/utils/toArray';
import toClassName from 'lib/js/utils/toClassName';

import Base from './Base';

class SelectMultipleInputBaseComponentLib extends Base {
    static propTypes = this._getPropTypes({
        loadOptions: PropTypes.func,
        options: PropTypes.array,
        async: PropTypes.bool,
        isMulti: PropTypes.bool,
        menuPlacement: PropTypes.string,
        menuPosition: PropTypes.string,
        placeholder: PropTypes.string,
        loadingPlaceholder: PropTypes.string,
    });

    static defaultProps = this._getDefaultProps({
        loadOptions: noop,
        options: [],
        async: false,
        isMulti: true,
        menuPlacement: 'auto',
        menuPosition: 'fixed',
        placeholder: '',
        loadingPlaceholder: '',
    });

    state = {
        value: this.formatValue(this.getPropsValue()),
    };

    static formatValue(value, props) {
        const inputProps = merge({}, SelectMultipleInputBaseComponentLib.defaultProps, props);

        value = map(toArray(value), (v) => String(v));

        return inputProps.isMulti === false
            ? head(value)
            : filter(
                  intersection(
                      value,
                      map(inputProps.options, (option) => String(option.value)),
                  ),
                  (v) => v !== undefined && v !== null && v !== '',
              ).sort();
    }

    componentDidUpdate(oldProps) {
        if (isEqual(this.props.options, oldProps.options) === false)
            this.setState({ value: this.formatValue(this.props.initialValue) });

        super.componentDidUpdate(oldProps);
    }

    getOptionLabel(value) {
        return find(this.props.options, (option) => String(option.value) === this.getOptionValue(value))?.label ?? '';
    }

    getOptionValue(value) {
        return String(value?.value ?? value);
    }

    isOptionSelected(option, options) {
        return options.indexOf(this.getOptionValue(option)) !== -1;
    }

    filterOption(candidate, input) {
        return String(this.getOptionLabel(candidate?.data ?? input)).indexOf(input) !== -1;
    }

    handleChange(option, action) {
        option = option ?? [];

        const values = cloneDeep(this.getValue());

        const value =
            ['clear', 'pop-value', 'remove-value'].indexOf(action.action) !== -1
                ? option
                : ['set-value'].indexOf(action.action) !== -1
                ? values.concat([option.value])
                : ['select-option'].indexOf(action.action) !== -1
                ? map(option, (o) => o?.value ?? o)
                : values;

        this.setValue(value, () => this.props.onChange(this.getValue()));
    }

    render() {
        const { loadOptions, options, disabled, async, ...rest } = this.props;

        const Component = async === false ? Select : Async;

        return (
            <Component
                {...this._removeProps(rest)}
                className={toClassName(['input-value input-value--select-multiple', rest.className])}
                value={this.getValue()}
                getOptionLabel={::this.getOptionLabel}
                getOptionValue={::this.getOptionValue}
                isDisabled={disabled}
                isOptionSelected={::this.isOptionSelected}
                filterOption={::this.filterOption}
                onChange={::this.handleChange}
                options={options}
                {...(async === false ? {} : { async, loadOptions })}
            />
        );
    }
}

export default SelectMultipleInputBaseComponentLib;
