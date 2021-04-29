'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import ModalSimple from '../../components/layout/ModalSimple';

import Text, { P } from '../../components/base/Text';

import Lang from '../../helpers/lang';
import History from '../../helpers/history'; // Use History to navigate, don't forget to call `this.modal.hide()`

class TestModalLayout extends React.PureComponent {
    static propTypes = {
        someProps: PropTypes.string,
    };

    static defaultProps = {
        someProps: '',
    };

    handleRef(ref) {
        this.modal = ref;
    }

    render() {
        const { someProps, ...rest } = this.props;

        return (
            <ModalSimple {...rest} className={toClassName(['modal-test', rest.className])} onRef={::this.handleRef}>
                {this.renderContent()}
            </ModalSimple>
        );
    }

    renderContent() {
        return <P>{this.props.someProps}</P>;
    }
}

export default TestModalLayout;
