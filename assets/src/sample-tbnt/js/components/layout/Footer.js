'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import Placeholder from '../base/Placeholder';

class FooterLayoutComponent extends React.PureComponent {
    state = {
        footer: null,
    };

    handleRef(ref) {
        this.$footer = ref;

        this.setState({ footer: ref });
    }

    render() {
        const { ...rest } = this.props;

        return (
            <Placeholder listen={this.state.footer}>
                <div {...rest} className={toClassName(['footer', rest.className])} ref={::this.handleRef}></div>
            </Placeholder>
        );
    }
}

export default FooterLayoutComponent;
