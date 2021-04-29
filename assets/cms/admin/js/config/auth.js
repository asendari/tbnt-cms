'use strict';

import ObjectHelper from 'lib/js/helpers/object';

const AuthConfig = new ObjectHelper({
    token_name: 'jwt_admin_token',
    user_url: '/auth/me',
    login_url: '/auth/login',
    logout_url: '/auth/logout',
    refresh_url: '/auth/refresh-token',
    check_timeout: 1000 * 60 * 8,
});

export default AuthConfig;
