'use strict';

/**
 * @name CheckboxListInputBaseComponentLib
 * @description Checkbox List Input base component for ReactJS personal library
 * @file ReactJS Checkbox List Input Component
 *
 * @version 1.2.1 - 2019-12-18
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import noop from 'lodash/noop';
import pull from 'lodash/pull';
import uniq from 'lodash/uniq';

import toArray from 'lib/js/utils/toArray';
import toClassName from 'lib/js/utils/toClassName';

import Base from './Base';
import Checkbox from './Checkbox';

class CheckboxListInputBaseComponentLib extends Base {
    static propTypes = this._getPropTypes({
        renderLabel: PropTypes.func,
        options: PropTypes.array,
    });

    static defaultProps = this._getDefaultProps({
        renderLabel: null,
        options: [],
    });

    state = {
        value: this.formatValue(this.getPropsValue()),
    };

    static formatValue(value) {
        return map(
            filter(toArray(value), (v) => v !== undefined && v !== null),
            String,
        ).sort();
    }

    componentDidUpdate(oldProps) {
        super.componentDidUpdate(oldProps);

        if (isEqual(this.props.options, oldProps.options) === false) this.setState({ value: this.formatValue(this.state.value) });
    }

    handleChange(value, checked) {
        value = String(value);

        let values = this.getValue();

        if (checked === true) values.push(value);
        else values = pull(values, value);

        values = uniq(values);

        this.setValue(values, () => this.props.onChange(this.getValue()));
    }

    render() {
        const { renderLabel, options, name, disabled, ...rest } = this.props;

        return (
            <div {...this._removeProps(rest)} className={toClassName(['input-value input-value--checkbox-list', rest.className])}>
                {map(options, ::this.renderCheckbox)}
            </div>
        );
    }

    renderCheckbox(item, index) {
        return (
            <CheckboxListCheckboxInputBaseComponentLib
                key={item.value}
                item={{
                    ...item,
                    name: this.props.name,
                    checked: this.getValue().indexOf(this.formatValue(item.value)[0]) !== -1,
                    disabled: this.props.disabled || item.disabled,
                }}
                renderLabel={item.renderLabel ?? this.props.renderLabel}
                onChange={::this.handleChange}
            />
        );
    }
}

const CheckboxListCheckboxInputBaseComponentLib = React.memo((props) => {
    const { onChange, renderLabel, item, ...rest } = props;

    const handleChange = (value) => onChange(item.value, value);

    const renderCheckbox = () => <Checkbox {...item} value={item.checked} renderLabel={renderLabel} onChange={handleChange} />;

    return (
        <div {...rest} className="input-value--checkbox-list-item">
            {(item.value === undefined && renderLabel(item.label)) || renderCheckbox()}
        </div>
    );
});

export default CheckboxListInputBaseComponentLib;
