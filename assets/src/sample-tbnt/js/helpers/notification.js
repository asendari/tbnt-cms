'use strict';

import NotificationHelperParent from 'lib/js/helpers/notification';

import merge from 'lodash/merge';

import BaseNotification from '../components/base/Notification';

class NotificationHelper extends NotificationHelperParent {
    #show(type, message, props = {}) {
        return this.show(BaseNotification, merge({ message }, props, { type }));
    }

    info(message, props = {}) {
        return this.#show('info', message, props);
    }

    success(message, props = {}) {
        return this.#show('success', message, props);
    }

    warning(message, props = {}) {
        return this.#show('warning', message, props);
    }

    danger(message, props = {}) {
        return this.#show('danger', message, props);
    }
}

const Notification = new NotificationHelper();

export default Notification;
