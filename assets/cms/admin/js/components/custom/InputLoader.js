'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import ErrorBoundary from '../layout/ErrorBoundary';
import InputLoader from '../layout/InputLoader';

import Card from './Card';

const InputLoaderCustomComponent = (props) => {
    const { renderLoader, renderError, ...rest } = props;

    const _renderLoader = (props) =>
        renderLoader !== null ? (
            renderLoader(props)
        ) : (
            <Card>
                <Card.Body loader={true} />
            </Card>
        );

    const _renderError = (props) => (renderError !== null ? renderError(props) : <ErrorBoundary error={true} />);

    return <InputLoader {...rest} renderLoader={_renderLoader} renderError={_renderError} />;
};

InputLoaderCustomComponent.propTypes = {
    renderLoader: PropTypes.func,
    renderError: PropTypes.func,
};

InputLoaderCustomComponent.defaultProps = {
    renderLoader: null,
    renderError: null,
};

export default React.memo(InputLoaderCustomComponent);
