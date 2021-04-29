'use strict';

import ServerHelperParent from 'lib/js/helpers/server';

import get from 'lodash/get';

import ServerConfig from '../config/server';

let isUnauthorizedModalOpened = false;

class ServerHelper extends ServerHelperParent {
    auth = null;
    lang = null;
    notification = null;

    init(auth, lang, notification) {
        this.auth = auth;
        this.lang = lang;
        this.notification = notification;
    }
}

const Server = new ServerHelper({
    ...ServerConfig.get(),

    before: (options) => {
        if (options.formHelper) options.formHelper.setUpdating?.(options.data);
    },
    success: (options, response) => {
        if (options.formHelper) options.formHelper.setSuccess?.(options.data);
    },
    error: (options, error, data) => {
        if (get(error, 'response.request.status') === 401) {
            if (Server.auth.hasToken() === false || options.url === Server.auth.config?.refresh_url) {
                Server.doError(options, error, data);
            } else {
                Server.auth.refreshToken((loggedIn) => {
                    if (loggedIn === true) Server.fetch(options.url, options);
                    else Server.doError(options, error, data);
                });
            }

            return false;
        }

        if (options.alert === true && get(error, 'response.request.status') === 400) {
            Server.notification.danger(data?.message || Server.lang.get('errors.general'));
        }

        if (options.alert === false) return;

        if (get(error, 'response.request.status') === 403) {
            Server.notification.danger(Server.lang.get('modules.errors.general'));
        } else if (get(error, 'response.request.status') === 404) {
            Server.notification.danger(Server.lang.get('modules.errors.general'));
        } else if (get(error, 'response.request.status') === 405) {
            Server.notification.danger(Server.lang.get('modules.errors.general'));
        } else if (get(error, 'response.request.status') === 413) {
            Server.notification.warning(Server.lang.get('modules.errors.post_too_large'));
        } else if (get(error, 'response.request.status') === 422) {
            if (options.formHelper) {
                options.formHelper.resetUpdating?.(options.data);
                options.formHelper.setErrors?.(get(error, 'response.data.errors', {}));
            }

            Server.notification.warning(Server.lang.get('modules.inputs.message_error_fields'));
        } else if (get(error, 'response.request.status') >= 500) {
            Server.notification.danger(Server.lang.get('modules.errors.general'));
        }
    },
});

export default Server;
