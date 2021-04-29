'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import withAnimations from '../hoc/Animations';

import ErrorBoundary from './ErrorBoundary';
import Footer from './Footer';
import Helmet from './Helmet';
import Menu from './Menu';
import Sidebar from './Sidebar';

class PageLayoutComponent extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        menu: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
        sidebar: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
        footer: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
        page: PropTypes.object,
        helmet: PropTypes.object,
    };

    static defaultProps = {
        menu: {},
        sidebar: {},
        footer: false,
        page: {},
        helmet: {},
    };

    componentDidMount() {
        this.props.animations.scrollTo(window, 0, { duration: 0 });
    }

    render() {
        const { animations, id, menu, sidebar, footer, page, helmet, children, ...rest } = this.props;

        return (
            <div {...rest} id={`page-${id}`} className={toClassName(['page', rest.className])}>
                <Helmet {...helmet} />

                <div className="page--content">
                    {sidebar !== false && (
                        <div className="page--left">
                            <Sidebar {...sidebar} />
                        </div>
                    )}

                    <div className="page--right">
                        {menu !== false && <Menu {...menu} />}

                        <ErrorBoundary>
                            <div {...page} className={toClassName(['page--container', page.className])}>
                                {children}
                            </div>
                        </ErrorBoundary>

                        {footer !== false && <Footer {...footer} />}
                    </div>
                </div>
            </div>
        );
    }
}

PageLayoutComponent = withAnimations(PageLayoutComponent);

export default PageLayoutComponent;
