'use strict';

import React from 'react';

import toClassName from 'lib/js/utils/toClassName';

import withAuth from '../../components/hoc/Auth';
import withServer from '../../components/hoc/Server';

import Page from '../../components/layout/Page';

import Card from '../../components/custom/Card';
import Header from '../../components/custom/Header';
import Pagination from '../../components/custom/Pagination';

import Link from '../../components/base/Link';

import Lang from '../../helpers/lang';

class CountriesPage extends React.Component {
    render() {
        return (
            <Page id="countries" helmet={Lang.get('countries.seo')} menu={{ title: Lang.get('countries.seo.title') }}>
                {this.renderContent()}
            </Page>
        );
    }

    renderContent() {
        return (
            <>
                <Header>
                    <Header.Title>{Lang.get('countries.header.title')}</Header.Title>
                </Header>
                <div className="container padding-24-left padding-24-right padding-40-top padding-40-bottom">
                    <Pagination
                        url="countries/list"
                        cacheId="countries"
                        duplicate="id"
                        renderItem={::this.renderPaginationItem}
                    />
                </div>
            </>
        );
    }

    renderPaginationItem(item, index) {
        return (
            <Link key={index} className="pagination--item" to={Lang.router('country').replace(':id', item.id)}>
                <Card className={toClassName([item.is_active === false && 'bg-overlay-white text-muted'])}>
                    <Card.Body>
                        <div className="flex">
                            <div className="flex-grow">
                                <span>{item.name}</span>
                            </div>
                            <div>
                                <span className={isActiveColors[Number(item.is_active)] ?? ''}>
                                    {Lang.get(`words.${item.is_active === true ? 'active' : 'inactive'}`)}
                                </span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Link>
        );
    }
}

const isActiveColors = {
    0: 'text-warning',
    1: 'text-success',
};

CountriesPage = withAuth(CountriesPage);
CountriesPage = withServer(CountriesPage);

export default CountriesPage;
