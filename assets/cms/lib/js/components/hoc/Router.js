'use strict';

/**
 * @name RouterHOCLib
 * @description Router HOC for ReactJS personal library
 * @file ReactJS Router HOC
 *
 * @version 1.1.1 - 2019-11-29
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import noop from 'lodash/noop';

export default (Component) => {
    class RouterHOCLib extends React.Component {
        handleRender(props) {
            return <Component {...this.props} router={props} />;
        }

        render() {
            return <RouterHOCComponentLib render={::this.handleRender} />;
        }
    }

    return RouterHOCLib;
};

class RouterHOCComponentLib extends React.Component {
    static propTypes = {
        render: PropTypes.func,
    };

    static defaultProps = {
        render: noop,
    };

    render() {
        return this.props.render({
            history: this.props.history,
            location: this.props.location,
            match: this.props.match,
            staticContext: this.props.staticContext,
        });
    }
}

RouterHOCComponentLib = withRouter(RouterHOCComponentLib);
