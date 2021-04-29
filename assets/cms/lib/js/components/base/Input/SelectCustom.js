'use strict';

/**
 * @name SelectCustomInputBaseComponentLib
 * @description SelectCustom Input base component for ReactJS personal library
 * @file ReactJS SelectCustom Input Component
 *
 * @version 1.1.1 - 2019-12-18
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import Base from './Base';
import Dropdown from '../Dropdown';

class SelectCustomInputBaseComponentLib extends Base {
    static propTypes = this._getPropTypes({
        renderLabel: PropTypes.func,
        options: PropTypes.array,
    });

    static defaultProps = this._getDefaultProps({
        renderLabel: noop,
        options: [],
    });

    state = {
        value: this.formatValue(this.getPropsValue()),
    };

    static formatValue(value, props) {
        return String(value);
    }

    componentDidUpdate(oldProps) {
        super.componentDidUpdate(oldProps);

        if (isEqual(this.props.options, oldProps.options) === false) this.setState({ value: this.formatValue(this.state.value) });
    }

    handleChange(option) {
        this.setValue(option.value, () => this.props.onChange(this.getValue()));
    }

    render() {
        const { renderLabel, ...rest } = this.props;

        return (
            <Dropdown
                {...this._removeProps(rest)}
                className={toClassName(['input-value input-value--select-custom', rest.className])}
                renderLabel={(props) => renderLabel({ ...props, value: this.getValue() })}
                onChange={::this.handleChange}
            />
        );
    }
}

export default SelectCustomInputBaseComponentLib;
