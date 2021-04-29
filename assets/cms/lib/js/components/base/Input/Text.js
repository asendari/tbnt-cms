'use strict';

/**
 * @name TextInputBaseComponentLib
 * @description Text Input base component for ReactJS personal library
 * @file ReactJS Text Input Component
 *
 * @version 1.1.3 - 2020-09-23
 * @author Alexandre Pilloud
 */

import toClassName from 'lib/js/utils/toClassName';
import merge from 'lodash/merge';
import PropTypes from 'prop-types';
import React from 'react';
import Base from './Base';

class TextInputBaseComponentLib extends Base {
    static propTypes = this._getPropTypes({
        modifier: PropTypes.func,
        dom: PropTypes.string,
        type: PropTypes.string,
        maxLength: PropTypes.number,
        disabled: PropTypes.bool,
    });

    static defaultProps = this._getDefaultProps({
        modifier: (v) => String(v ?? ''),
        dom: 'input',
        type: 'text',
        maxLength: null,
        disabled: null,
    });

    state = {
        value: this.formatValue(this.getPropsValue()),
    };

    static formatValue(value, props) {
        props = merge({}, TextInputBaseComponentLib.defaultProps, props);
        value = props.modifier(value);

        if (props.maxLength !== null && props.maxLength - value.length < 0) value = value.slice(0, props.maxLength);

        return value;
    }

    getCharCount() {
        return this.getValue().length;
    }

    handleChange(e) {
        this.setValue(e.target.value, () => this.props.onChange(this.getValue()));
    }

    render() {
        const { modifier, dom: Input, ...rest } = this.props;

        return (
            <Input
                {...this._removeProps(rest)}
                className={toClassName([`input-value input-value--${rest.type}`, rest.className])}
                value={this.getValue()}
                disabled={rest.disabled}
                onChange={::this.handleChange}
                ref={::this.handleInputRef}
            />
        );
    }
}

export default TextInputBaseComponentLib;
