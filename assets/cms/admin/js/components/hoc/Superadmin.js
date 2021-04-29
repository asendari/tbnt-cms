'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import SuperadminOut from '../layout/SuperadminOut';

import User from '../../helpers/user';

export default (Component, forceLogout = true) => {
    class SuperadminHOC extends React.Component {
        handleRender(props) {
            return <Component {...this.props} />;
        }

        render() {
            return <SuperadminHOCComponent forceLogout={forceLogout} render={::this.handleRender} />;
        }
    }

    return SuperadminHOC;
};

class SuperadminHOCComponent extends React.Component {
    static propTypes = {
        render: PropTypes.func,
        forceLogout: PropTypes.bool,
    };

    static defaultProps = {
        render: noop,
        forceLogout: true,
    };

    render() {
        return this.props.forceLogout === true && User.isSuperadmin() === false ? this.renderLoggedOut() : this.renderLoggedIn();
    }

    renderLoggedIn() {
        return this.props.render({});
    }

    renderLoggedOut() {
        return <SuperadminOut />;
    }
}
