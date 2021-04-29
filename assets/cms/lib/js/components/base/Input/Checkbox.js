'use strict';

/**
 * @name CheckboxInputBaseComponentLib
 * @description Checkbox Input base component for ReactJS personal library
 * @file ReactJS Checkbox Input Component
 *
 * @version 1.1.2 - 2020-09-24
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import isFunc from 'lib/js/utils/isFunc';
import toBool from 'lib/js/utils/toBool';
import toClassName from 'lib/js/utils/toClassName';

import Text from '../Text';

import Base from './Base';

class CheckboxInputBaseComponentLib extends Base {
    static propTypes = this._getPropTypes({
        renderLabel: PropTypes.func,
        label: PropTypes.any,
        type: PropTypes.string,
    });

    static defaultProps = this._getDefaultProps({
        renderLabel: null,
        label: '',
        type: 'checkbox',
    });

    state = {
        value: this.formatValue(this.getPropsValue()),
    };

    static formatValue(value) {
        return toBool(value);
    }

    handleChange(value) {
        this.setValue(value, () => this.props.onChange(this.getValue()));
    }

    handleInputChange(e) {
        this.handleChange(e.target.checked);
    }

    handleInvert() {
        this.handleChange(this.getValue() === false);
    }

    render() {
        const { renderLabel, label, type, name, disabled, ...rest } = this.props;

        return (
            <span
                {...this._removeProps(rest)}
                className={toClassName([`input-value input-value--${type}`, this.state.value && '--checked', rest.className])}
            >
                <span className={`input-value--${type}-input`}>
                    <input
                        type={type}
                        name={name}
                        disabled={disabled}
                        checked={this.getValue()}
                        onChange={::this.handleInputChange}
                        ref={::this.handleInputRef}
                    />
                </span>
                <span className={`input-value--${type}-label`}>{this.renderLabel()}</span>
            </span>
        );
    }

    renderLabel() {
        const { renderLabel, label, type, disabled } = this.props;

        if (isFunc(renderLabel) === true) return renderLabel({ label, onClick: ::this.handleInvert });

        return (
            <Text
                className={`input-value--${type}-label-default`}
                onClick={::this.handleInvert}
                style={{ pointerEvents: disabled ? 'none' : 'all' }}
            >
                {label}
            </Text>
        );
    }
}

export default CheckboxInputBaseComponentLib;
