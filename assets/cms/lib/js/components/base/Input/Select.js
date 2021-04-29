'use strict';

/**
 * @name SelectInputBaseComponentLib
 * @description Select Input base component for ReactJS personal library
 * @file ReactJS Select Input Component
 *
 * @version 1.1.6 - 2019-12-19
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import noop from 'lodash/noop';
import pick from 'lodash/pick';

import toClassName from 'lib/js/utils/toClassName';

import Base from './Base';

class SelectInputBaseComponentLib extends Base {
    static propTypes = this._getPropTypes({
        options: PropTypes.array,
        empty: PropTypes.bool,
        placeholder: PropTypes.any,
    });

    static defaultProps = this._getDefaultProps({
        options: [],
        empty: false,
        placeholder: 'Please select...',
    });

    state = {
        value: this.formatValue(this.getPropsValue()),
    };

    static formatValue(value) {
        return String(value ?? '');
    }

    componentDidUpdate(oldProps) {
        super.componentDidUpdate(oldProps);

        if (isEqual(this.props.options, oldProps.options) === false) this.setState({ value: this.formatValue(this.state.value) });
    }

    handleChange() {
        this.setValue(this.$input.options[this.$input.selectedIndex].value, () => this.props.onChange(this.getValue()));
    }

    render() {
        const { options, empty, placeholder, ...rest } = this.props;

        return (
            <select
                {...this._removeProps(rest)}
                className={toClassName(['input-value input-value--select', rest.className])}
                value={this.getValue()}
                disabled={this.props.disabled || this.props.readOnly === true}
                onChange={::this.handleChange}
                ref={::this.handleInputRef}
            >
                {empty === true && <option value="">{placeholder}</option>}

                {map(options, (item, index) => (
                    <option key={index} {...pick(item, ['value', 'disabled'])}>
                        {item.label}
                    </option>
                ))}
            </select>
        );
    }
}

export default SelectInputBaseComponentLib;
