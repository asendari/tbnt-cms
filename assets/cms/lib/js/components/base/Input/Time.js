'use strict';

/**
 * @name TimeInputBaseComponentLib
 * @description Time Input base component for ReactJS personal library
 * @file ReactJS Time Input Component
 *
 * @version 1.1.1 - 2019-07-25
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';
import fp from 'flatpickr';

import merge from 'lodash/merge';

import isArray from 'lib/js/utils/isArray';

import Datetime from './Datetime';

import { datefns } from 'lib/js/helpers/datefns';

class TimeInputBaseComponentLib extends Datetime {
    static defaultProps = merge({}, Datetime.defaultProps, {
        type: 'time',
    });

    static formatValue(value, props) {
        value = (isArray(value) === true ? value[0] : value) || null;

        if (value === null) return null;

        const timeParts = String(value).split(':');
        const formatParts = String(props.altTimeFormat).split(':');

        value = datefns();

        if (timeParts[0] !== undefined && formatParts[0] !== undefined) value.setHours(timeParts[0]);
        if (timeParts[1] !== undefined && formatParts[1] !== undefined) value.setMinutes(timeParts[1]);
        if (timeParts[2] !== undefined && formatParts[2] !== undefined) value.setSeconds(timeParts[2]);

        if (value.isValid() === false) return null;

        return value && fp.formatDate(value.toDate(), Datetime.getDateFormat(merge({}, Datetime.defaultProps, props)));
    }

    handleClose(date, value, e) {
        if (this.props.type === 'time' && value === '') super.handleClose();
        else
            this.setValue(value, () => {
                this.props.onChange(value);
                super.handleClose();
            });
    }
}

export default TimeInputBaseComponentLib;
