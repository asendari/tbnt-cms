'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import Button from 'lib/js/components/base/Button';
import Modal from '../base/Modal';

import SVGClose from '../svg/close';

import Styles from '../../helpers/styles';

class ModalFullLayoutComponent extends React.Component {
    static propTypes = {
        onRef: PropTypes.func,
        closeColor: PropTypes.string,
        closePosition: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
    };

    static defaultProps = {
        onRef: noop,
        closeColor: Styles.get('secondary'),
        closePosition: 'top-right',
    };

    handleClose() {
        this.modal.hide();
    }

    handleRef(ref) {
        this.modal = ref;

        this.props.onRef(ref);
    }

    render() {
        const { onRef, closeColor, closeBgColor, closePosition, children, ...rest } = this.props;

        return (
            <Modal {...rest} className={toClassName(['modal-full', rest.className])} onRef={::this.handleRef}>
                <div className="modal-full--body">{children}</div>
                <div className={toClassName(['modal-full--close', `--${closePosition}`])} onClick={::this.handleClose}>
                    <SVGClose color={closeColor} />
                </div>
            </Modal>
        );
    }
}

export default ModalFullLayoutComponent;
