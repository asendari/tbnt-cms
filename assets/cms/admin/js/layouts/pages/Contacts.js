'use strict';

import React from 'react';

import head from 'lodash/head';
import map from 'lodash/map';
import merge from 'lodash/merge';
import trim from 'lodash/trim';

import withAuth from '../../components/hoc/Auth';
import withTimeout from 'lib/js/components/hoc/Timeout';

import Page from '../../components/layout/Page';

import Button from '../../components/base/Button';
import Input from '../../components/base/Input';
import Link from '../../components/base/Link';

import Card from '../../components/custom/Card';
import Header from '../../components/custom/Header';
import Pagination from '../../components/custom/Pagination';

import Lang from '../../helpers/lang';
import Notification from '../../helpers/notification';
import Post from '../../helpers/post';

let orderCache = '';

class ContactsPage extends React.Component {
    state = {
        order: orderCache ?? head(orderOptions)?.value,
    };

    paginationTimeout = -1;
    paginationTimeoutTime = 1000 * 0.3;

    refreshPagination() {
        this.props.timeout.clear(this.paginationTimeout);
        this.paginationTimeout = this.props.timeout.set(() => this.pagination.emptyData(), this.paginationTimeoutTime);
    }

    handleOrder(order) {
        orderCache = order;
        this.setState({ order }, ::this.refreshPagination);
    }

    handlePaginationRef(ref) {
        this.pagination = ref;
    }

    render() {
        return (
            <Page
                id="contacts"
                helmet={{ title: Lang.get('contacts.general.seo.title') }}
                menu={{ title: Lang.get('contacts.general.seo.title') }}
                sidebar={{ active: 'contacts' }}
            >
                {this.renderContent()}
            </Page>
        );
    }

    renderContent() {
        return (
            <>
                <Header>
                    <Header.Title>{Lang.get('contacts.general.header.title')}</Header.Title>
                </Header>
                <div className="container padding-24-left padding-24-right padding-40-top padding-40-bottom">
                    <Pagination
                        url="contacts"
                        cacheId="contacts"
                        duplicate="id"
                        queryData={merge(...[this.state.order ? { order: this.state.order } : {}])}
                        renderHeader={::this.renderPaginationHeader}
                        renderItem={::this.renderPaginationItem}
                        onRef={::this.handlePaginationRef}
                    />
                </div>
            </>
        );
    }

    renderPaginationHeader({ count, text, buttonProps }) {
        return (
            <div className="width-1-1 flex flex-middle margin-24-bottom">
                <div className="pagination--header-refresh pointer">
                    <Button {...buttonProps}>{text}</Button>
                </div>
                <div className="flex flex-grow flex-right">
                    <div className="width-1-4">
                        <Input
                            type="select"
                            input={{ options: orderOptions }}
                            initialValue={this.state.order}
                            onChange={::this.handleOrder}
                        />
                    </div>
                </div>
            </div>
        );
    }

    renderPaginationItem(item, index) {
        return (
            <div key={index} className="pagination--item">
                <Card>
                    <Card.Body>
                        <div className="flex">
                            <p className="width-1-6 flex-noshrink">{Lang.get('contacts.general.rows.email')}</p>
                            <Link href={item.email} prefix="mailto">
                                {item.email}
                            </Link>
                        </div>
                        <div className="flex">
                            <p className="width-1-6 flex-noshrink">{Lang.get('contacts.general.rows.date')}</p>
                            <p>{Lang.date('dd_mm_d_y_h_m', item.created_at)}</p>
                        </div>

                        {map(item.content, (value, key) => (
                            <div key={key} className="flex">
                                <p className="width-1-6 flex-noshrink">{`[${key}]`}</p>
                                <p>{String(value)}</p>
                            </div>
                        ))}
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

const orderOptions = [
    { value: 'created_at-1', label: Lang.get('pagination.orders.created_at_1') },
    { value: 'created_at-0', label: Lang.get('pagination.orders.created_at_0') },
    { value: 'email-1', label: Lang.get('pagination.orders.email_1') },
    { value: 'email-0', label: Lang.get('pagination.orders.email_0') },
];

ContactsPage = withAuth(ContactsPage);
ContactsPage = withTimeout(ContactsPage);

export default ContactsPage;
