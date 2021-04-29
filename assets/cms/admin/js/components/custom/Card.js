'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import InputLoader from '../layout/InputLoader';

class CardHeaderCustomComponent extends React.PureComponent {
    render() {
        const { children, ...rest } = this.props;

        return (
            <div {...rest} className={toClassName(['card--header', rest.className])}>
                {children}
            </div>
        );
    }
}

class CardBodyCustomComponent extends React.PureComponent {
    static propTypes = {
        loader: PropTypes.bool,
        error: PropTypes.bool,
        content: PropTypes.bool,
    };

    static defaultProps = {
        loader: false,
        error: false,
        content: true,
    };

    render() {
        const { loader, error, content, children, ...rest } = this.props;

        const _renderContent = () => children;

        return (
            <div {...rest} className={toClassName(['card--body', rest.className])}>
                <InputLoader loader={loader} error={error} content={content} renderContent={_renderContent} />
            </div>
        );
    }
}

class CardFooterCustomComponent extends React.PureComponent {
    render() {
        const { children, ...rest } = this.props;

        return (
            <div {...rest} className={toClassName(['card--footer', rest.className])}>
                {children}
            </div>
        );
    }
}

class CardCustomComponent extends React.PureComponent {
    static Header = CardHeaderCustomComponent;
    static Body = CardBodyCustomComponent;
    static Footer = CardFooterCustomComponent;

    render() {
        const { children, ...rest } = this.props;

        return (
            <div {...rest} className={toClassName(['card', rest.className])}>
                {children}
            </div>
        );
    }
}

export default CardCustomComponent;
