'use strict';

/**
 * @name HiddenInputBaseComponentLib
 * @description Hidden Input base component for ReactJS personal library
 * @file ReactJS Hidden Input Component
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import Text from './Text';

class HiddenInputBaseComponentLib extends React.PureComponent {
    static defaultProps = {
        type: 'hidden',
    };

    render() {
        return <Text {...this.props} />;
    }
}

export default HiddenInputBaseComponentLib;
