'use strict';

/**
 * @name DateInputBaseComponentLib
 * @description Date Input base component for ReactJS personal library
 * @file ReactJS Date Input Component
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import Datetime from './Datetime';

class DateInputBaseComponentLib extends React.PureComponent {
    static defaultProps = {
        type: 'date',
    };

    render() {
        return <Datetime {...this.props} />;
    }
}

export default DateInputBaseComponentLib;
