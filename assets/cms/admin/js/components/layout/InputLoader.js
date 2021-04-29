'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import Lang from '../../helpers/lang';

const InputLoaderLayoutComponent = (props) => {
    const { renderLoader, renderError, renderContent, loader, error, content, children, ...rest } = props;

    const defaultTextLoader = Lang.get('inputs.message_loading_content');
    const defaultTextNoContent = Lang.get('inputs.message_no_content');
    const defaultTextError = Lang.get('errors.general');

    return (
        (loader === true && (renderLoader !== null ? renderLoader({ text: defaultTextLoader }) : <p>{defaultTextLoader}</p>)) ||
        (error === true && (renderError !== null ? renderError({ text: defaultTextError }) : <p>{defaultTextError}</p>)) ||
        (content === false && <p>{defaultTextNoContent}</p>) ||
        renderContent()
    );
};

InputLoaderLayoutComponent.propTypes = {
    renderLoader: PropTypes.func,
    renderError: PropTypes.func,
    renderContent: PropTypes.func.isRequired,
    loader: PropTypes.bool,
    error: PropTypes.bool,
    content: PropTypes.bool,
};

InputLoaderLayoutComponent.defaultProps = {
    renderLoader: null,
    renderError: null,
    loader: false,
    error: false,
    content: true,
};

export default React.memo(InputLoaderLayoutComponent);
