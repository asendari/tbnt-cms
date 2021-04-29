'use strict';

/**
 * @name RadioInputBaseComponentLib
 * @description Radio Input base component for ReactJS personal library
 * @file ReactJS Radio Input Component
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from './Checkbox';

class RadioInputBaseComponentLib extends React.PureComponent {
    static defaultProps = {
        type: 'radio',
    };

    render() {
        return <Checkbox {...this.props} />;
    }
}

export default RadioInputBaseComponentLib;
