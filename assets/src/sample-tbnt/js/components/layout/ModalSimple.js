'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import Modal from '../base/Modal';

import SVGClose from '../svg/close';

import Styles from '../../helpers/styles';

class ModalSimpleLayoutComponent extends React.Component {
    static propTypes = {
        onRef: PropTypes.func,
        onClose: PropTypes.func,
        renderHeader: PropTypes.func,
        renderFooter: PropTypes.func,
        closeColor: PropTypes.string,
        closePosition: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
    };

    static defaultProps = {
        onRef: noop,
        onClose: noop,
        renderHeader: null,
        renderFooter: null,
        closeColor: Styles.get('secondary'),
        closePosition: 'top-right',
    };

    handleClose() {
        this.modal.hide();
        this.props.onClose();
    }

    handleRef(ref) {
        this.modal = ref;

        this.props.onRef(ref);
    }

    render() {
        const { onRef, renderHeader, renderFooter, closeColor, closePosition, children, ...rest } = this.props;

        return (
            <Modal {...rest} className={toClassName(['modal-simple', rest.className])} onRef={::this.handleRef}>
                <div className="modal-simple--content">
                    {renderHeader !== null && <div className="modal-simple--header">{renderHeader()}</div>}

                    <div className="modal-simple--body">{children}</div>

                    {renderFooter !== null && <div className="modal-simple--footer">{renderFooter()}</div>}

                    <div className={toClassName(['modal-simple--close', `--${closePosition}`])} onClick={::this.handleClose}>
                        <SVGClose color={closeColor} />
                    </div>
                </div>
                <div className="modal-simple--overlay" onClick={::this.handleClose} />
            </Modal>
        );
    }
}

export default ModalSimpleLayoutComponent;
