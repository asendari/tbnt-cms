'use strict';

/**
 * @name PasswordInputBaseComponentLib
 * @description Password Input base component for ReactJS personal library
 * @file ReactJS Password Input Component
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import Text from './Text';

class PasswordInputBaseComponentLib extends React.PureComponent {
    static defaultProps = {
        type: 'password',
    };

    render() {
        return <Text {...this.props} />;
    }
}

export default PasswordInputBaseComponentLib;
