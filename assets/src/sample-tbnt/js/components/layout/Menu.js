'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

class MenuLayoutComponent extends React.PureComponent {
    static propTypes = {
        helmet: PropTypes.object,
    };

    static defaultProps = {
        helmet: {},
    };

    render() {
        const { helmet, ...rest } = this.props;

        return <div {...rest} className={toClassName(['menu', rest.className])}></div>;
    }
}

export default MenuLayoutComponent;
