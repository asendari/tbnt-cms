'use strict';

import ObjectHelper from 'lib/js/helpers/object';

const AuthConfig = new ObjectHelper({
    token_name: 'jwt_app_token',
    user_url: '/auth/me',
    signin_url: '/auth/signin',
    login_url: '/auth/login',
    logout_url: '/auth/logout',
    refresh_url: '/auth/refresh-token',
    check_timeout: 1000 * 60 * 8,
});

export default AuthConfig;
