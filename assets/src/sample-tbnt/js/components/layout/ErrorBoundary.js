'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import isNoop from 'lib/js/utils/isNoop';

import Lang from '../../helpers/lang';

class ErrorBoundaryLayoutComponent extends React.Component {
    static propTypes = {
        renderError: PropTypes.func,
        error: PropTypes.bool,
    };

    static defaultProps = {
        renderError: noop,
        error: false,
    };

    state = {
        hasError: this.props.error,
    };

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
    }

    render() {
        if (this.props.error === true || this.state.hasError === true) return this.renderError();

        return this.props.children;
    }

    renderError() {
        if (isNoop(this.props.renderError) === false) return this.props.renderError();

        return (
            <div className="error-boundary">
                <div className="container">
                    <div className="content --small center margin-96-top margin-96-bottom">
                        <h1 className="h2 margin-24-bottom" data-scrollo="fade-up">
                            {Lang.get('modules.errors.general')}
                        </h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorBoundaryLayoutComponent;
