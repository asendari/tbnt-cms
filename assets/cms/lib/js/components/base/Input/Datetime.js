'use strict';

/**
 * @name DatetimeInputBaseComponentLib
 * @description Datetime Input base component for ReactJS personal library
 * @file ReactJS Datetime Input Component
 *
 * @version 1.1.4 - 2020-09-22
 * @author Alexandre Pilloud
 */

import fp from 'flatpickr';
import DateFns, { datefns } from 'lib/js/helpers/datefns';
import isArray from 'lib/js/utils/isArray';
import nextTick from 'lib/js/utils/nextTick';
import toClassName from 'lib/js/utils/toClassName';
import { isEqual, merge, noop } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Flatpickr from 'react-flatpickr';
import Base from './Base';

class DatetimeInputBaseComponentLib extends Base {
    static propTypes = this._getPropTypes({
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        renderClose: PropTypes.func,
        type: PropTypes.string,
        dateFormat: PropTypes.string,
        datetimeFormat: PropTypes.string,
        timeFormat: PropTypes.string,
        altDateFormat: PropTypes.string,
        altDatetimeFormat: PropTypes.string,
        altTimeFormat: PropTypes.string,
        options: PropTypes.object,
        min: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(DateFns)]),
        max: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(DateFns)]),
        step: PropTypes.number,
        readOnly: PropTypes.bool,
        disabled: PropTypes.bool,
    });

    static defaultProps = this._getDefaultProps({
        onFocus: noop,
        onBlur: noop,
        renderClose: () => <span>&times;</span>,
        type: 'datetime',
        datetimeFormat: 'Z',
        dateFormat: 'Y-m-d',
        timeFormat: 'H:i',
        altDatetimeFormat: 'F j Y, H:i',
        altDateFormat: 'F j Y',
        altTimeFormat: 'H:i',
        options: {},
        min: null,
        max: null,
        step: 1,
        readOnly: false,
        disabled: false,
    });

    state = {
        value: this.formatValue(this.getPropsValue()),
    };

    isUpdatable() {
        return isEqual(this.formatValue(this.state.value), this.formatValue(this.props.initialValue)) === false;
    }

    static formatValue(value, props) {
        value = (isArray(value) === true ? value[0] : value) || null;
        if (value === null) return null;

        value = datefns(value);
        if (value.isValid() === false) return null;

        return (
            value &&
            fp.formatDate(
                value.toDate(),
                DatetimeInputBaseComponentLib.getDateFormat(merge({}, DatetimeInputBaseComponentLib.defaultProps, props)),
            )
        );
    }

    static getDateFormat(props) {
        return props.type === 'datetime' ? props.datetimeFormat : props.type === 'date' ? props.dateFormat : props.timeFormat;
    }

    getDateFormat() {
        return DatetimeInputBaseComponentLib.getDateFormat(this.props);
    }

    getAltFormat() {
        return this.props.type === 'datetime'
            ? this.props.altDatetimeFormat
            : this.props.type === 'date'
            ? this.props.altDateFormat
            : this.props.altTimeFormat;
    }

    getOptions() {
        const options = merge(
            {},
            {
                dateFormat: this.getDateFormat(),
                altFormat: this.getAltFormat(),
                altInput: true,
                weekNumbers: true,
                time_24hr: true,
                disableMobile: true,
                enableTime: this.props.type !== 'date',
                noCalendar: this.props.type === 'time',
                clickOpens: this.props.readOnly === false && this.props.disabled === false,
                minuteIncrement: this.props.step,
            },
            this.props.type === 'time'
                ? {}
                : {
                      locale: {
                          firstDayOfWeek: 1,
                      },
                  },
            this.props.options,
        );

        if (this.props.min !== null) options.minDate = this.formatValue(this.props.min);
        if (this.props.max !== null) options.maxDate = this.formatValue(this.props.max);

        return options;
    }

    focus() {
        this.$input.flatpickr.open();
    }

    blur() {
        this.$input.flatpickr.close();
    }

    handleOpen(date, value, e) {
        this.props.onFocus();
    }

    handleClose(date, value, e) {
        nextTick(::this.props.onBlur);
    }

    handleChange(date, value, e) {
        this.setValue(value, () => this.props.onChange(this.getValue()));
    }

    handleClear(e) {
        this.setValue(null, () => this.props.onChange(this.getValue()));
    }

    render() {
        const {
            onFocus,
            onBlur,
            renderClose,
            dateFormat,
            datetimeFormat,
            timeFormat,
            altDateFormat,
            altDatetimeFormat,
            altTimeFormat,
            type,
            options,
            min,
            max,
            step,
            readOnly,
            ...rest
        } = this.props;

        return (
            <>
                <Flatpickr
                    {...this._removeProps(rest)}
                    className={toClassName([`input-value input-value--${type}`, rest.className])}
                    options={this.getOptions()}
                    value={this.state.value}
                    onOpen={::this.handleOpen}
                    onClose={::this.handleClose}
                    onChange={::this.handleChange}
                    ref={::this.handleInputRef}
                />

                {readOnly === false && rest.disabled === false && (
                    <div className={'input-clear'} onClick={::this.handleClear}>
                        {renderClose()}
                    </div>
                )}
            </>
        );
    }
}

export default DatetimeInputBaseComponentLib;
