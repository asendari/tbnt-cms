'use strict';

import React from 'react';

import withTransition from '../../components/hoc/Transition';

import Page from '../../components/layout/Page';

import Link from '../../components/base/Link';
import Text, { H1, P } from '../../components/base/Text';

import Lang from '../../helpers/lang';

class Error404PageLayout extends React.Component {
    render() {
        return <Page id="error-404">{this.renderContent()}</Page>;
    }

    renderContent() {
        return (
            <div className="container vheight-min flex flex-middle">
                <div className="content center">
                    <H1 className="h2 margin-32-bottom" data-scrollo="fade-up">
                        {Lang.get('pages.error404.title')}
                    </H1>
                    <P className="margin-48-bottom" data-scrollo="fade-up">
                        {Lang.get('pages.error404.message')}
                    </P>
                    <Link data-scrollo="fade-up" to={Lang.router('home')}>
                        {Lang.get('pages.error404.back')}
                    </Link>
                </div>
            </div>
        );
    }
}

Error404PageLayout = withTransition(Error404PageLayout);

export default Error404PageLayout;
