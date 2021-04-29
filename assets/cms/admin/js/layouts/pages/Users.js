'use strict';

import React from 'react';

import head from 'lodash/head';
import map from 'lodash/map';
import merge from 'lodash/merge';

import call from 'lib/js/utils/call';
import toClassName from 'lib/js/utils/toClassName';

import withAuth from '../../components/hoc/Auth';
import withServer from '../../components/hoc/Server';
import withTimeout from 'lib/js/components/hoc/Timeout';

import Page from '../../components/layout/Page';

import Card from '../../components/custom/Card';
import Header from '../../components/custom/Header';
import Pagination from '../../components/custom/Pagination';

import Button from '../../components/base/Button';
import Input from '../../components/base/Input';
import Link from '../../components/base/Link';

import Cache from '../../helpers/cache';
import Lang from '../../helpers/lang';

const cacheItemsCreated = 'users:itemCreated';
const cacheItemsUpdated = 'users:itemUpdated';
const cacheItemsDeleted = 'users:itemDeleted';

let searchCache = '';
let orderCache = head(orderOptions)?.value;

class UsersPage extends React.Component {
    state = {
        search: searchCache,
        order: orderCache,
    };

    searchTimeout = -1;
    searchTimeoutTime = 1000 * 0.7;

    paginationTimeout = -1;
    paginationTimeoutTime = 1000 * 0.3;

    updatePagination() {
        if (Cache.has(cacheItemsCreated) === true) {
            this.pagination.emptyData();
        } else {
            if (Cache.has(cacheItemsUpdated) === true) map(Cache.get(cacheItemsUpdated), ::this.pagination.updateRow);
            if (Cache.has(cacheItemsDeleted) === true) map(Cache.get(cacheItemsDeleted), ::this.pagination.removeRow);
        }

        Cache.unset(cacheItemsCreated);
        Cache.unset(cacheItemsUpdated);
        Cache.unset(cacheItemsDeleted);
    }

    refreshPagination() {
        if (this.pagination === undefined) return;

        this.props.timeout.clear(this.paginationTimeout);
        this.paginationTimeout = this.props.timeout.set(() => this.pagination.emptyData(), this.paginationTimeoutTime);
    }

    handleSearch(search, cb) {
        this.props.timeout.clear(this.searchTimeout);
        this.searchTimeout = this.props.timeout.set(() => {
            searchCache = search;
            this.setState({ search }, () => {
                call(cb);
                this.refreshPagination();
            });
        }, this.searchTimeoutTime);
    }

    handleOrder(order, cb) {
        orderCache = order;

        this.setState({ order }, () => {
            call(cb);
            this.refreshPagination();
        });
    }

    handlePaginationRef(ref) {
        this.pagination = ref;

        this.updatePagination();
    }

    render() {
        return (
            <Page
                id="users"
                helmet={Lang.get('users.seo')}
                menu={{ title: Lang.get('users.seo.title') }}
                sidebar={{ active: 'users' }}
            >
                {this.renderContent()}
            </Page>
        );
    }

    renderContent() {
        return (
            <>
                <Header>
                    <div className="flex flex-between flex-middle">
                        <Header.Title>{Lang.get('users.header.title')}</Header.Title>
                        <div className="width-1-3">
                            <Input
                                type="text"
                                input={{
                                    placeholder: Lang.get('pagination.filters.search'),
                                }}
                                initialValue={this.state.search}
                                onChange={::this.handleSearch}
                            />
                        </div>
                    </div>
                </Header>
                <div className="container padding-24-left padding-24-right padding-40-top padding-40-bottom">
                    <Pagination
                        url="users"
                        cacheId="users"
                        duplicate="id"
                        queryData={merge(
                            ...[
                                this.state.order ? { order: this.state.order } : {},
                                this.state.search ? { search: this.state.search } : {},
                            ],
                        )}
                        renderHeader={::this.renderPaginationHeader}
                        renderItem={::this.renderPaginationItem}
                        onRef={::this.handlePaginationRef}
                    />
                </div>
            </>
        );
    }

    renderPaginationHeader({ ended, count, text, buttonProps }) {
        return (
            <div className="width-1-1 flex flex-middle margin-24-bottom">
                <div className="pagination--header-refresh pointer">
                    <Button {...buttonProps}>{text}</Button>
                </div>
                <div className="flex flex-grow flex-right">
                    <div className="width-1-4">
                        <Input
                            type="select"
                            input={{ options: orderOptions, placeholder: Lang.get('pagination.filters.order') }}
                            initialValue={this.state.order}
                            onChange={::this.handleOrder}
                        />
                    </div>
                    <Button className="--info margin-16-left" to={Lang.router('user').replace(':id', 'new')}>
                        {Lang.get('words.create')}
                    </Button>
                </div>
            </div>
        );
    }

    renderPaginationItem(item, index) {
        return (
            <Link key={index} className="pagination--item" to={Lang.router('user').replace(':id', item.id)}>
                <Card className={toClassName([item.is_active === false && 'bg-overlay-white text-muted'])}>
                    <Card.Body>
                        <div className="flex">
                            <div className="flex-grow">
                                <span>
                                    {item.profile?.name} - {item.profile?.email}
                                </span>
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

const orderOptions = [
    { value: 'created_at-1', label: Lang.get('pagination.orders.created_at_1') },
    { value: 'created_at-0', label: Lang.get('pagination.orders.created_at_0') },
    { value: 'updated_at-1', label: Lang.get('pagination.orders.updated_at_1') },
    { value: 'updated_at-0', label: Lang.get('pagination.orders.updated_at_0') },
    { value: 'firstname-1', label: Lang.get('pagination.orders.firstname_1') },
    { value: 'firstname-0', label: Lang.get('pagination.orders.firstname_0') },
    { value: 'lastname-1', label: Lang.get('pagination.orders.lastname_1') },
    { value: 'lastname-0', label: Lang.get('pagination.orders.lastname_0') },
    { value: 'email-1', label: Lang.get('pagination.orders.email_1') },
    { value: 'email-0', label: Lang.get('pagination.orders.email_0') },
];

UsersPage = withAuth(UsersPage);
UsersPage = withServer(UsersPage);
UsersPage = withTimeout(UsersPage);

export default UsersPage;
