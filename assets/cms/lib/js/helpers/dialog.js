'use strict';

/**
 * @name DialogHelperLib
 * @description Dialog helper for ReactJS personal library
 * @file ReactJS Dialog helper
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import React from 'react';
import ReactDOM from 'react-dom';

import map from 'lodash/map';

import uniqId from 'lib/js/utils/uniqId';
import createAppendElement from 'lib/js/utils/createAppendElement';

class DialogHelperLib {
    dialogs = {};

    parentElem = null;

    #create(id = null) {
        const rootElemRef = document.createElement('div');

        if (id !== null) rootElemRef.setAttribute('id', `dialog-${id}`);

        this.parentElem = createAppendElement('dialog-wrapper');
        this.parentElem.appendChild(rootElemRef);

        return rootElemRef;
    }

    show(Component, props = {}) {
        const dialogId = uniqId();
        const dialog = this.#create(dialogId);

        const hide = () => this.hide(dialogId);

        this.dialogs[dialogId] = dialog;

        Component = <Component {...props} dialog={{ hide }} />;

        ReactDOM.render(Component, dialog);

        return {
            id: dialogId,
            hide,
        };
    }

    hide(dialogId) {
        if (this.dialogs[dialogId] !== undefined) {
            ReactDOM.unmountComponentAtNode(this.dialogs[dialogId]);
            this.dialogs[dialogId]?.remove();
        }

        delete this.dialogs[dialogId];

        if (this.parentElem.childNodes.length === 0) this.parentElem.remove();
    }

    hideAll() {
        map(this.dialogs, (portal, dialogId) => this.hide(dialogId));
    }
}

export default DialogHelperLib;
