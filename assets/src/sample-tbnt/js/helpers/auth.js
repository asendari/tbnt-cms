'use strict';

import AuthHelperParent from 'lib/js/helpers/auth';

import map from 'lodash/map';
import merge from 'lodash/merge';

import call from 'lib/js/utils/call';

import AuthConfig from '../config/auth';

const defaultTimeout = 1000 * 60 * 8;

class AuthHelper extends AuthHelperParent {
    server = null;
    statux = null;
    user = null;

    isRefreshingToken = false;
    refreshingCallbacks = [];
    checkTimeout = null;

    init(server, statux, user) {
        this.server = server;
        this.statux = statux;
        this.user = user;
    }

    setLoginData(token, user = null) {
        // this.startCheck();
        this.setToken(token);

        this.server.setAuthorization(token);
        this.statux.set('loggedIn', true);

        if (user !== null) this.user.reset(user);
    }

    removeLoginData() {
        this.stopCheck();
        this.removeToken();

        this.server.setAuthorization(null);
        this.statux.set('loggedIn', false);

        this.user.reset();
    }

    signin(config, cb) {
        this.server.fetch(
            this.config.signin_url,
            merge({}, config, {
                method: 'POST',
                success: (response, data) => {
                    this.setLoginData(data.token, data.data);

                    call(cb, true, response, data);
                },
                error: (error, data) => {
                    this.removeLoginData();

                    call(cb, false, error, data);
                },
            }),
        );
    }

    login(config, cb) {
        this.server.fetch(
            this.config.login_url,
            merge({}, config, {
                method: 'POST',
                success: (response, data) => {
                    this.setLoginData(data.token, data.data);

                    call(cb, true, response, data);
                },
                error: (error, data) => {
                    this.removeLoginData();

                    call(cb, false, error, data);
                },
            }),
        );
    }

    logout(cb, config = {}) {
        this.server.fetch(
            this.config.logout_url,
            merge({}, config, {
                complete: (success, response, data) => {
                    this.removeLoginData();

                    call(cb, success, response, data);
                },
            }),
        );
    }

    refreshToken(cb, config = {}) {
        this.refreshingCallbacks.push(cb);

        if (this.isRefreshingToken === true) return;

        this.isRefreshingToken = true;

        this.server.fetch(
            this.config.refresh_url,
            merge({}, config, {
                success: (response, data) => {
                    this.setLoginData(data.token, data?.data ?? null);

                    map(this.refreshingCallbacks, (cb) => call(cb, true, response, data));
                },
                error: (error, data) => {
                    this.removeLoginData();

                    map(this.refreshingCallbacks, (cb) => call(cb, false, error, data));
                },
                complete: (success, response, data) => {
                    this.isRefreshingToken = false;
                    this.refreshingCallbacks = [];
                },
            }),
        );
    }

    fetchUser(cb, config = {}) {
        if (this.hasToken() === false) return call(cb, false);

        this.server.fetch(
            this.config.user_url,
            merge({}, config, {
                success: (response, data) => {
                    this.user.reset(data.data);
                    this.statux.set('loggedIn', true);

                    call(cb, true, response, data);
                },
                error: (error, data) => {
                    this.user.reset();
                    this.statux.set('loggedIn', false);

                    call(cb, false, error, data);
                },
            }),
        );
    }

    startCheck() {
        this.stopCheck();

        this.checkTimeout = setTimeout(() => this.refreshToken(), this.config.check_timeout ?? defaultTimeout);
    }

    stopCheck() {
        clearTimeout(this.checkTimeout);
    }
}

const Auth = new AuthHelper(AuthConfig.get());

export default Auth;
