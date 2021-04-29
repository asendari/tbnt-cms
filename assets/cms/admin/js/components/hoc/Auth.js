'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import call from 'lib/js/utils/call';

import withStatux from './Statux';

import LoggedOut from '../layout/LoggedOut';

import Auth from '../../helpers/auth';
import History from '../../helpers/history';
import Lang from '../../helpers/lang';

export default (Component, forceLogout = true) => {
    class AuthHOC extends React.Component {
        handleRender(props) {
            return <Component {...this.props} auth={props} />;
        }

        render() {
            return <AuthHOCComponent forceLogout={forceLogout} render={::this.handleRender} />;
        }
    }

    return AuthHOC;
};

class AuthHOCComponent extends React.Component {
    static propTypes = {
        render: PropTypes.func,
        forceLogout: PropTypes.bool,
    };

    static defaultProps = {
        render: noop,
        forceLogout: true,
    };

    state = {
        loggedIn: this.props.statux.loggedIn,
    };

    preventRedirect = [Lang.router('home'), Lang.router('login')];

    onAuthCallback = noop;

    componentDidMount() {
        if (Auth.hasToken() === false) this.redirectLogin();
    }

    componentDidUpdate(oldProps) {
        if (this.props.statux.loggedIn !== oldProps.statux.loggedIn)
            this.setState({ loggedIn: this.props.statux.loggedIn }, () => {
                if (oldProps.statux.loggedIn === null) this.emitAuth();
            });
    }

    redirectLogin() {
        if (this.props.forceLogout === true) History.replace(`${Lang.router('login')}${this.getRedirectQuery()}`);
    }

    getRedirectQuery() {
        return this.preventRedirect.indexOf(History.location.pathname) === -1 ? `?redirect=${window.location.href}` : '';
    }

    emitAuth() {
        call(this.onAuthCallback, this.state.loggedIn);
    }

    onAuth(cb) {
        this.onAuthCallback = cb;

        if (this.state.loggedIn !== null) this.emitAuth();
    }

    render() {
        return this.props.forceLogout === true && (Auth.hasToken() === false || this.state.loggedIn === false)
            ? this.renderLoggedOut()
            : this.renderLoggedIn();
    }

    renderLoggedIn() {
        return this.props.render({
            fetch: ::Auth.fetchUser,
            login: ::Auth.login,
            logout: ::Auth.logout,
            loggedIn: this.state.loggedIn,
            onAuth: ::this.onAuth,
        });
    }

    renderLoggedOut() {
        return <LoggedOut />;
    }
}

AuthHOCComponent = withStatux(AuthHOCComponent, ['loggedIn']);
