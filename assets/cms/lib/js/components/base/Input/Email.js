'use strict';

/**
 * @name EmailInputBaseComponentLib
 * @description Email Input base component for ReactJS personal library
 * @file ReactJS Email Input Component
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import Text from './Text';

class EmailInputBaseComponentLib extends React.PureComponent {
    static defaultProps = {
        type: 'email',
    };

    render() {
        return <Text {...this.props} />;
    }
}

export default EmailInputBaseComponentLib;
