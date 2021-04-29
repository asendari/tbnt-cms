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
import InputLoader from '../../components/custom/InputLoader';
import Pagination from '../../components/custom/Pagination';

import Button from '../../components/base/Button';
import Input from '../../components/base/Input';
import Link from '../../components/base/Link';

import Cache from '../../helpers/cache';
import Lang from '../../helpers/lang';
import User from '../../helpers/user';

import AppConfig from '../../config/app';

const cacheItemsCreated = 'posts:itemCreated';
const cacheItemsUpdated = 'posts:itemUpdated';
const cacheItemsDeleted = 'posts:itemDeleted';

let searchCache = {};
let orderCache = {};
let parentCache = {};

class PostsPage extends React.Component {
    type = this.props.match.params?.type || this.props.location.key;
    postType = Cache.get(`posts_types.${this.type}`, null) ?? null;

    cacheItemsCreated = `${cacheItemsCreated}:${this.type}`;
    cacheItemsUpdated = `${cacheItemsUpdated}:${this.type}`;
    cacheItemsDeleted = `${cacheItemsDeleted}:${this.type}`;

    state = {
        postType: this.postType,
        postsParents: [],
        search: searchCache[this.type] ?? '',
        order: orderCache[this.type] ?? head(orderOptions)?.value,
        parent: parentCache[this.type] ?? '',
        loader: true,
        error: false,
    };

    searchTimeout = -1;
    searchTimeoutTime = 1000 * 0.7;

    paginationTimeout = -1;
    paginationTimeoutTime = 1000 * 0.3;

    isSuperadmin = User.isSuperadmin();

    componentDidMount() {
        if (this.state.postType === null) this.fetchPostType();
        else this.onPostType();
    }

    onPostType() {
        const done = () => {
            if (this.state.postType === null) this.setState({ loader: false, error: true });
            else if (this.isAuthorized('post_id') === true) this.fetchPostParents();
            else this.setState({ loader: false });
        };

        if (!this.getConfig('order')) done();
        else this.handleOrder(this.getConfig('order'), done);
    }

    fetchPostType() {
        this.setState({ loader: true }, () =>
            this.props.server.fetch(`posts-types/${this.type}`, {
                method: 'post',
                success: (response, { data: postType }) => {
                    Cache.set(`posts_types.${this.type}`, postType);

                    this.setState({ postType }, ::this.onPostType);
                },
                error: (error, data) => {
                    this.setState({ loader: false, error: true });
                },
            }),
        );
    }

    fetchPostParents() {
        const postType = this.getConfig('parent_post_type', AppConfig.get('types.page'));

        this.props.server.fetch(`posts/${postType}`, {
            method: 'post',
            data: { order: 'reference-0' },
            alert: true,
            success: (response, { data }) => {
                this.setState((oldState) => ({
                    postsParents: [{ label: Lang.get('inputs.empty'), value: String(0) }].concat(
                        map(data, (option) => ({
                            label: option.reference,
                            value: String(option.id),
                        })),
                    ),
                }));
            },
        });
    }

    getConfig(key, defaultValue = null) {
        return this.state.postType?.config?.[key] ?? defaultValue;
    }

    getConfigMode(key) {
        const mode = this.getConfig('modes', {})[key] ?? null;

        return mode === null ? null : Number(mode) || 0;
    }

    isAuthorized(key) {
        if (this.state.postType !== null) return false;

        const mode = this.getConfigMode(key);

        if (mode === null) return true;

        return User.isAuthorized(mode);
    }

    updatePagination() {
        if (Cache.has(this.cacheItemsCreated) === true) {
            this.pagination.emptyData();
        } else {
            if (Cache.has(this.cacheItemsUpdated) === true) map(Cache.get(this.cacheItemsUpdated), ::this.pagination.updateRow);
            if (Cache.has(this.cacheItemsDeleted) === true) map(Cache.get(this.cacheItemsDeleted), ::this.pagination.removeRow);
        }

        Cache.unset(this.cacheItemsCreated);
        Cache.unset(this.cacheItemsUpdated);
        Cache.unset(this.cacheItemsDeleted);
    }

    refreshPagination() {
        if (this.pagination?.emptyData === undefined) return;

        this.props.timeout.clear(this.paginationTimeout);
        this.paginationTimeout = this.props.timeout.set(() => this.pagination.emptyData(), this.paginationTimeoutTime);
    }

    handleSearch(search, cb) {
        this.props.timeout.clear(this.searchTimeout);
        this.searchTimeout = this.props.timeout.set(() => {
            searchCache[this.type] = search;
            this.setState({ search }, () => {
                call(cb);
                this.refreshPagination();
            });
        }, this.searchTimeoutTime);
    }

    handleOrder(order, cb) {
        orderCache[this.type] = order;

        this.setState({ order }, () => {
            call(cb);
            this.refreshPagination();
        });
    }

    handleParent(parent, cb) {
        parentCache[this.type] = parent;

        this.setState({ parent }, () => {
            call(cb);
            this.refreshPagination();
        });
    }

    handlePaginationRef(ref) {
        this.pagination = ref;

        this.updatePagination();
    }

    render() {
        const seo = { title: Lang.get('posts.seo.title', this.state.postType?.label) };

        return (
            <Page id="posts" helmet={seo} menu={seo} sidebar={{ active: ['posts', { type: this.type }] }}>
                {this.renderContent()}
            </Page>
        );
    }

    renderContent() {
        return (
            <>
                <Header>
                    <div className="flex flex-between flex-middle">
                        <Header.Title>{Lang.get('posts.header.title', this.state.postType?.label)}</Header.Title>

                        {this.state.loader === false && (
                            <div className="width-1-3">
                                <Input
                                    type="text"
                                    input={{ placeholder: Lang.get('pagination.filters.search') }}
                                    initialValue={this.state.search}
                                    onChange={::this.handleSearch}
                                />
                            </div>
                        )}
                    </div>
                </Header>
                <div className="container padding-24-left padding-24-right padding-40-top padding-40-bottom">
                    <InputLoader loader={this.state.loader} error={this.state.error} renderContent={::this.renderPagination} />
                </div>
            </>
        );
    }

    renderPagination() {
        return (
            <Pagination
                url={`posts/${this.type}`}
                cacheId={`posts:${this.type}`}
                duplicate="id"
                queryData={merge(
                    ...[
                        this.state.order ? { order: this.state.order } : {},
                        this.state.parent ? { post_id: this.state.parent } : {},
                        this.state.search ? { search: { reference: this.state.search } } : {},
                    ],
                )}
                renderHeader={::this.renderPaginationHeader}
                renderItem={::this.renderPaginationItem}
                onRef={::this.handlePaginationRef}
            />
        );
    }

    renderPaginationHeader({ ended, count, text, buttonProps }) {
        return (
            <div className="width-1-1 flex flex-middle margin-24-bottom">
                <div className="pagination--header-refresh pointer">
                    <Button {...buttonProps}>{text}</Button>
                </div>
                <div className="flex flex-grow flex-right">
                    {this.state.postsParents.length !== 0 && (
                        <div className="width-1-4">
                            <Input
                                type="select"
                                input={{
                                    options: this.state.postsParents,
                                    placeholder: Lang.get('pagination.filters.parent'),
                                }}
                                initialValue={this.state.parent}
                                onChange={::this.handleParent}
                            />
                        </div>
                    )}

                    <div className="width-1-4">
                        <Input
                            type="select"
                            input={{ options: orderOptions, placeholder: Lang.get('pagination.filters.order') }}
                            initialValue={this.state.order}
                            onChange={::this.handleOrder}
                        />
                    </div>

                    {(this.isSuperadmin === true || this.state.postType.mode === 3) && (
                        <Button
                            className="--info margin-16-left"
                            superadmin={this.state.postType.mode < 3}
                            to={Lang.router('post').replace(':type', this.type).replace(':id', 'new')}
                        >
                            {Lang.get('words.create')}
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    renderPaginationItem(item, index) {
        return (
            <Link
                key={index}
                className="pagination--item"
                to={Lang.router('post').replace(':type', this.type).replace(':id', item.id)}
            >
                <Card className={toClassName([item.is_active === false && 'bg-overlay-white text-muted'])}>
                    <Card.Body>
                        <div className="flex">
                            <div className="flex-grow">
                                <span>{item.reference}</span>
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
    { value: 'reference-1', label: Lang.get('pagination.orders.reference_1') },
    { value: 'reference-0', label: Lang.get('pagination.orders.reference_0') },
];

PostsPage = withAuth(PostsPage);
PostsPage = withServer(PostsPage);
PostsPage = withTimeout(PostsPage);

export default PostsPage;
