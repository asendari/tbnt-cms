'use strict';

/**
 * @name UrlInputBaseComponentLib
 * @description Url Input base component for ReactJS personal library
 * @file ReactJS Url Input Component
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import Text from './Text';

class UrlInputBaseComponentLib extends React.PureComponent {
    static defaultProps = {
        type: 'url',
    };

    render() {
        return <Text {...this.props} />;
    }
}

export default UrlInputBaseComponentLib;
