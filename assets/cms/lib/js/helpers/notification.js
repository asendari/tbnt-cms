'use strict';

/**
 * @name NotificationHelperLib
 * @description Notification helper for ReactJS personal library
 * @file ReactJS Notification helper
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import React from 'react';
import ReactDOM from 'react-dom';

import map from 'lodash/map';

import uniqId from 'lib/js/utils/uniqId';
import createAppendElement from 'lib/js/utils/createAppendElement';

class NotificationHelperLib {
    notifications = {};

    parentElem = null;

    #create(id = null) {
        const rootElemRef = document.createElement('div');

        if (id !== null) rootElemRef.setAttribute('id', `notification-${id}`);

        this.parentElem = createAppendElement('notification-wrapper');
        this.parentElem.appendChild(rootElemRef);

        return rootElemRef;
    }

    show(Component, props = {}) {
        const notificationId = uniqId();
        const notification = this.#create(notificationId);

        const hide = () => this.hide(notificationId);

        this.notifications[notificationId] = notification;

        Component = <Component {...props} notification={{ hide }} />;

        ReactDOM.render(Component, notification);

        return {
            id: notificationId,
            hide,
        };
    }

    hide(notificationId) {
        if (this.notifications[notificationId] !== undefined) {
            ReactDOM.unmountComponentAtNode(this.notifications[notificationId]);
            this.notifications[notificationId]?.remove();
        }

        delete this.notifications[notificationId];

        if (this.parentElem.childNodes.length === 0) this.parentElem.remove();
    }

    hideAll() {
        map(this.notifications, (portal, notificationId) => this.hide(notificationId));
    }
}

export default NotificationHelperLib;
