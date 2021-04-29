'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import call from 'lib/js/utils/call';

import withStatux from './Statux';

import LoggedOut from '../layout/LoggedOut';

import AppConfig from '../../config/app';

import Auth from '../../helpers/auth';
import Cache from '../../helpers/cache';
import History from '../../helpers/history';

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
        if (this.props.forceLogout === true) History.replace(Cache.get('pages.home')?.getUrl?.() ?? AppConfig.get('url'));
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
            signin: ::Auth.signin,
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
