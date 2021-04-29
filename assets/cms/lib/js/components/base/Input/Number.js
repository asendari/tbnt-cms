'use strict';

/**
 * @name NumberInputBaseComponentLib
 * @description Number Input base component for ReactJS personal library
 * @file ReactJS Number Input Component
 *
 * @version 1.1.1 - 2019-07-01
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import Text from './Text';

class NumberInputBaseComponentLib extends React.PureComponent {
    static defaultProps = {
        type: 'number',
        modifier: (v) => (v !== null && !isNaN(v) && String(v).trim() !== '' ? Number(v) : ''),
    };

    render() {
        return <Text {...this.props} />;
    }
}

export default NumberInputBaseComponentLib;
