'use strict';

/**
 * @name AuthHelperLib
 * @description Auth helper for ReactJS personal library
 * @file ReactJS Auth helper
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import decode from 'jwt-decode';

import merge from 'lodash/merge';

import uniqId from 'lib/js/utils/uniqId';

class AuthHelperLib {
    constructor(options = {}) {
        this.config = merge({ token_name: `${uniqId()}_token` }, options);
    }

    isLoggedIn() {
        const token = this.getToken();
        return token !== null && this.isTokenExpired(token) === false;
    }

    isTokenExpired(token) {
        try {
            return decode(token).exp < Date.now() / 1000;
        } catch (err) {
            return true;
        }
    }

    hasToken() {
        return this.getToken() !== null;
    }

    setToken(token) {
        localStorage.setItem(this.config.token_name, token);
    }

    getToken() {
        return localStorage.getItem(this.config.token_name) || null;
    }

    removeToken() {
        localStorage.removeItem(this.config.token_name);
    }
}

export default AuthHelperLib;
