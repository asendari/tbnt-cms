'use strict';

/**
 * @name ModalHelperLib
 * @description Modal helper for ReactJS personal library
 * @file ReactJS Modal helper
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import React from 'react';
import ReactDOM from 'react-dom';

import map from 'lodash/map';

import uniqId from 'lib/js/utils/uniqId';
import createAppendElement from 'lib/js/utils/createAppendElement';

class ModalHelperLib {
    modals = {};

    parentElem = null;

    #create(id = null) {
        const rootElemRef = document.createElement('div');

        if (id !== null) rootElemRef.setAttribute('id', `modal-${id}`);

        this.parentElem = createAppendElement('modal-wrapper');
        this.parentElem.appendChild(rootElemRef);

        return rootElemRef;
    }

    show(Component, props = {}) {
        const modalId = uniqId();
        const modal = this.#create(modalId);

        const hide = () => this.hide(modalId);

        this.modals[modalId] = modal;

        Component = <Component {...props} modal={{ hide }} />;

        ReactDOM.render(Component, modal);

        return {
            id: modalId,
            hide,
        };
    }

    hide(modalId) {
        if (this.modals[modalId] !== undefined) {
            ReactDOM.unmountComponentAtNode(this.modals[modalId]);
            this.modals[modalId]?.remove();
        }

        delete this.modals[modalId];

        if (this.parentElem.childNodes.length === 0) this.parentElem.remove();
    }

    hideAll() {
        map(this.modals, (portal, modalId) => this.hide(modalId));
    }
}

export default ModalHelperLib;
