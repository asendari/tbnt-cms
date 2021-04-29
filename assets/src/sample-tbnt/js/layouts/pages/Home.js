'use strict';

import React from 'react';

import withTransition from '../../components/hoc/Transition';

import Page from '../../components/layout/Page';

import Link from '../../components/base/Link';
import Text, { H1 } from '../../components/base/Text';

import Cache from '../../helpers/cache';
import Lang from '../../helpers/lang';
import Modal from '../../helpers/modal';

class HomePageLayout extends React.Component {
    page = Cache.get('pages.home');

    handleModal() {
        Modal.showTest({ someProps: this.page.getItem('details.title') });
    }

    render() {
        return (
            <Page id="home" helmet={this.page.getSeo()}>
                {this.renderContent()}
            </Page>
        );
    }

    renderContent() {
        return (
            <div className="container vheight-min flex flex-middle">
                <div className="content center">
                    <H1 className="h2 margin-32-bottom" data-scrollo="fade-up">
                        TBNT CMS
                    </H1>
                    <div>
                        <Link className="margin-48-right" data-scrollo="fade-up" href="https://laravel.com">
                            Laravel
                        </Link>
                        <Link className="margin-48-right" data-scrollo="fade-up" href="https://bitbucket.org/tbntswiss/cms">
                            Documentation
                        </Link>
                        <Link className="margin-48-right" data-scrollo="fade-up" href="https://tbnt.digital">
                            tbnt.digital
                        </Link>
                        <Link data-scrollo="fade-up" onClick={::this.handleModal}>
                            {Lang.get('cms.words.words.modal')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

HomePageLayout = withTransition(HomePageLayout);

export default HomePageLayout;
