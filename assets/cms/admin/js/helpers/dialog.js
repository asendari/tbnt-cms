'use strict';

import DialogHelperParent from 'lib/js/helpers/dialog';

import merge from 'lodash/merge';

import BaseDialog from '../components/base/Dialog';

class DialogHelper extends DialogHelperParent {
    #show(type, message, props = {}) {
        return this.show(BaseDialog, merge({ message }, props, { type }));
    }

    dialog(message, props = {}) {
        return this.#show('dialog', message, props);
    }

    confirm(message, props = {}) {
        return this.#show('confirm', message, props);
    }
}

const Dialog = new DialogHelper();

export default Dialog;
