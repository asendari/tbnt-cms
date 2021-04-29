'use strict';

import React from 'react';
import PropTypes from 'prop-types';

class LoaderLayoutComponent extends React.PureComponent {
    render() {
        return (
            <div {...this.props} className="logged-out">
                Logged out!
            </div>
        );
    }
}

export default LoaderLayoutComponent;
