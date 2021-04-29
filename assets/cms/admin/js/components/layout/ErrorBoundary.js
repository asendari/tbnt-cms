'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import Lang from '../../helpers/lang';

class ErrorBoundaryLayoutComponent extends React.Component {
    static propTypes = {
        renderError: PropTypes.func,
        error: PropTypes.bool,
    };

    static defaultProps = {
        renderError: null,
        error: false,
    };

    state = {
        hasError: false,
    };

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
    }

    isError() {
        return this.props.error === true || this.state.hasError === true;
    }

    render() {
        return (this.isError() === true ? this.renderError() : this.props.children) || null;
    }

    renderError() {
        return this.props.renderError !== null ? (
            this.props.renderError()
        ) : (
            <div className="error-boundary">
                <h1>{Lang.get('errors.general')}</h1>
            </div>
        );
    }
}

export default ErrorBoundaryLayoutComponent;
