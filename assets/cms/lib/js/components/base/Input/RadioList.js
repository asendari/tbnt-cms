'use strict';

/**
 * @name RadioListInputBaseComponentLib
 * @description Radio List Input base component for ReactJS personal library
 * @file ReactJS Radio List Input Component
 *
 * @version 1.1.1 - 2019-12-18
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import Base from './Base';
import Radio from './Radio';

class RadioListInputBaseComponentLib extends Base {
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

    static formatValue(value) {
        return String(value ?? '');
    }

    componentDidUpdate(oldProps) {
        super.componentDidUpdate(oldProps);

        if (isEqual(this.props.options, oldProps.options) === false) this.setState({ value: this.formatValue(this.state.value) });
    }

    handleChange(value) {
        this.setValue(value, () => this.props.onChange(this.getValue()));
    }

    render() {
        const { renderLabel, options, name, disabled, ...rest } = this.props;

        return (
            <div {...this._removeProps(rest)} className={toClassName(['input-value input-value--radio-list', rest.className])}>
                {map(options, ::this.renderRadio)}
            </div>
        );
    }

    renderRadio(item, index) {
        return (
            <RadioListRadioInputBaseComponentLib
                key={item.value}
                item={{
                    ...item,
                    name: this.props.name,
                    value: this.getValue() === this.formatValue(item.value),
                    disabled: this.props.disabled || item.disabled,
                }}
                renderLabel={item.renderLabel ?? this.props.renderLabel}
                onChange={::this.handleChange}
            />
        );
    }
}

const RadioListRadioInputBaseComponentLib = React.memo((props) => {
    const { onChange, renderLabel, item, ...rest } = props;

    const renderRadio = () => <Radio {...item} renderLabel={renderLabel} onChange={onChange} />;

    return (
        <div {...rest} className="input-value--radio-list-item">
            {(item.value === undefined && renderLabel(item.label)) || renderRadio()}
        </div>
    );
});

export default RadioListInputBaseComponentLib;
