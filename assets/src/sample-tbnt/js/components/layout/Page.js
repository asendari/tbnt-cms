'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import withAnimations from '../hoc/Animations';

import ErrorBoundary from './ErrorBoundary';
import Footer from './Footer';
import Helmet from './Helmet';
import Menu from './Menu';

import Scrollo from '../../helpers/scrollo';

class PageLayoutComponent extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        helmet: PropTypes.object,
        container: PropTypes.object,
        menu: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
        footer: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    };

    static defaultProps = {
        helmet: {},
        container: {},
        menu: {},
        footer: {},
    };

    componentWillUnmount() {
        Scrollo?.destroyElements();
    }

    componentDidMount() {
        this.props.animations.scrollTo(window, 0, { duration: 0 });
    }

    render() {
        const { animations, id, menu, contact, footer, container, helmet, children, ...rest } = this.props;

        return (
            <div {...rest} id={`page-${id}`} className={toClassName(['page', rest.className])}>
                <Helmet {...helmet} />

                {menu !== false && <Menu {...menu} helmet={helmet} />}

                <ErrorBoundary>
                    <div {...container} className={toClassName(['page--container', container.className])}>
                        {children}
                    </div>
                </ErrorBoundary>

                {footer !== false && <Footer {...footer} />}
            </div>
        );
    }
}

PageLayoutComponent = withAnimations(PageLayoutComponent);

export default PageLayoutComponent;
