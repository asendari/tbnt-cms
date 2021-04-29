'use strict';

import React from 'react';

import withAuth from 'cms-admin/js/components/hoc/Auth';

import Page from 'cms-admin/js/components/layout/Page';

import Header from 'cms-admin/js/components/custom/Header';

import Lang from 'cms-admin/js/helpers/lang';

class TestPage extends React.Component {
    render() {
        return (
            <Page id="test" helmet={Lang.get('test.seo')} menu={{ title: Lang.get('test.seo.title') }}>
                {this.renderContent()}
            </Page>
        );
    }

    renderContent() {
        return (
            <>
                <Header>
                    <Header.Title>{Lang.get('test.header.title')}</Header.Title>
                </Header>
                <div className="container padding-24">
                    <p>This is a custom page.</p>
                    <br />
                    <p>
                        If you don't want that, it's probably because you published{' '}
                        <code>php artisan vendor:publish --tag=cms.assets.admin.install</code>.
                    </p>
                    <br />
                    <p>
                        If it was unintentional, you can delete <code>assets/src/admin</code> and{' '}
                        <code>assets/src/sample-admin</code> and you can republish using{' '}
                        <code>php artisan vendor:publish --tag=cms.assets.install</code>.
                    </p>
                </div>
            </>
        );
    }
}

TestPage = withAuth(TestPage);

export default TestPage;
