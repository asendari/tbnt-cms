'use strict';

import ModalHelperParent from 'lib/js/helpers/modal';

// import ModalTest from '../layouts/modals/Test';

class ModalHelper extends ModalHelperParent {
    showTest(props = {}) {
        // return this.show(ModalTest, props);
    }
}

const Modal = new ModalHelper();

export default Modal;
