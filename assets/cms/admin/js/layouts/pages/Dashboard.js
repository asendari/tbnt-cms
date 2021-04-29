'use strict';

import React from 'react';
import URI from 'urijs';

import head from 'lodash/head';
import keys from 'lodash/keys';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import size from 'lodash/size';

import isString from 'lib/js/utils/isString';
import makeUrl from 'lib/js/utils/makeUrl';

import withAuth from '../../components/hoc/Auth';

import Page from '../../components/layout/Page';

import Header from '../../components/custom/Header';

import Cache from '../../helpers/cache';
import Lang from '../../helpers/lang';
import Styles from '../../helpers/styles';

import AppConfig from '../../config/app';
import SidebarConfig from '../../config/sidebar';

class DashboardPage extends React.Component {
    constructor(props) {
        super(props);

        const redirectUrl = this.getRedirectUrl();

        if (redirectUrl !== null) props.history.replace(redirectUrl);
    }

    getRedirectUrl() {
        const redirect = URI().query(true).redirect ?? null;

        if (redirect) return makeUrl(redirect.replace(AppConfig.get('url'), ''), true);

        let route = SidebarConfig.get('default_route') ?? null;

        if (isString(route) === true) return Lang.router(route);

        const type = SidebarConfig.get('default_post') ?? null;

        if (isString(type) === true) {
            route = { router: 'posts', args: { type } };
        } else {
            const postsTypes = Cache.get('posts_types');

            if (size(postsTypes) === 0) return null;

            route = { router: 'posts', args: { type: head(map(postsTypes)).type } };
        }

        return reduce(route.args ?? [], (result, value, key) => result.replace(`:${key}`, value), Lang.router(route.router));
    }

    render() {
        return (
            <Page id="dashboard" helmet={Lang.get('dashboard.seo')} menu={{ title: Lang.get('dashboard.seo.title') }}>
                {this.renderContent()}
            </Page>
        );
    }

    renderContent() {
        return (
            <>
                <Header>
                    <Header.Title>{Lang.get('dashboard.header.title')}</Header.Title>
                </Header>
                <div className="container padding-24" />
            </>
        );
    }
}

DashboardPage = withAuth(DashboardPage);

export default DashboardPage;
