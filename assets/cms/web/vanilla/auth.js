'use strict';

import axios from 'axios';

import get from 'lodash/get';
import noop from 'lodash/noop';

import isDev from './isDev';

const session = 'cms_session_web';

const token = window.localStorage.getItem(session) || null;

if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

const auth = (options = {}) =>
    axios('auth/refresh-token', {
        baseURL: get(window, 'Laravel.app.url') + '/cms/web',
    })
        .then((response) => {
            const data = response.data;

            window.localStorage.setItem(session, data.token);

            if (isDev === true) console.log('CMS::auth:success', { response, data });

            get(options, 'success', noop)(response, data);
        })
        .catch((error) => {
            window.localStorage.removeItem(session);

            error.response.status === 401 ? console.log('CMS::auth:401', { error }) : console.error('CMS::auth:error', { error });

            get(options, 'error', noop)(error);
        });

export default auth;
