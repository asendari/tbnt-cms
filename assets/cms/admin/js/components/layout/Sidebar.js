'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'natural-orderby';

import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import upperFirst from 'lodash/upperFirst';

import isArray from 'lib/js/utils/isArray';
import toArray from 'lib/js/utils/toArray';
import toClassName from 'lib/js/utils/toClassName';

import withStatux from '../hoc/Statux';

import Link from '../base/Link';
import Minifiable from '../base/Minifiable';

import Cache from '../../helpers/cache';
import History from '../../helpers/history';
import Lang from '../../helpers/lang';
import User from '../../helpers/user';

import SidebarConfig from '../../config/sidebar';

class SidebarLayoutComponent extends React.PureComponent {
    static propTypes = {
        active: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    };

    static defaultProps = {
        active: null,
    };

    state = {
        postsTypes: Cache.get('posts_types'),
    };

    currentPathname = History.location.pathname;

    formatPostsTypes(postsTypes) {
        return map(orderBy(map(postsTypes), 'label'), (postType) => ({
            tabs: { menu: postType.label, router: 'posts', args: { type: postType.type } },
        }));
    }

    render() {
        const { statux, active, ...rest } = this.props;

        const postsTypes = this.formatPostsTypes(this.state.postsTypes);

        return (
            <div {...rest} className={toClassName(['sidebar', rest.className])}>
                <div className="sidebar--content">
                    <div className="sidebar--title">
                        <span>{Lang.get('sidebar.title')}</span>
                    </div>
                    <div className="sidebar--separator" />

                    {statux.loggedIn === true && (
                        <div className="sidebar--links">
                            {postsTypes === null &&
                                this.renderItem({
                                    tabs: { menu: Lang.get('words.loading_dot') },
                                })}

                            {map(postsTypes, ::this.renderItem)}
                            {map(SidebarConfig.get('items'), ::this.renderItem)}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    renderItem(sidebarItem, index = 0) {
        if (!sidebarItem) return null;

        const items = map(
            filter(toArray(sidebarItem?.tabs), (tab) => tab?.superadmin !== true || User.isSuperadmin() === true),
            (item) => {
                if (!item) return null;

                item.link = reduce(
                    item.args ?? [],
                    (result, value, key) => result.replace(`:${key}`, value),
                    Lang.router(item.router),
                );
                item.current =
                    (isArray(this.props.active) === true
                        ? item.router === this.props.active[0] && isEqual(item.args ?? [], this.props.active[1] ?? []) === true
                        : item.router === this.props.active) || item.link === this.currentPathname;

                return item;
            },
        );

        if (items.length === 0) return null;
        else if (items.length === 1) return this.renderLink(items[0], index);
        else return this.renderMinifiable(sidebarItem, index, items);
    }

    renderLink(item, index) {
        return <LinkSidebarLayoutComponent key={index} item={item} />;
    }

    renderMinifiable(sidebarItem, index, items = []) {
        return <MinifiableSidebarLayoutComponent key={index} sidebarItem={sidebarItem} items={items} />;
    }
}

class LinkSidebarLayoutComponent extends React.PureComponent {
    static propTypes = {
        item: PropTypes.object,
    };

    static defaultProps = {
        item: {},
    };

    render() {
        const { item } = this.props;

        const transKey = `sidebar.items.${item.menu}`;
        const transValue = Lang.get(transKey);

        return (
            <Link className={toClassName([item.current === true && '--active'])} to={item.link}>
                {`[${transKey}]` === transValue ? upperFirst(item.menu).split('-').join(' ') : transValue}
            </Link>
        );
    }
}

class MinifiableSidebarLayoutComponent extends React.PureComponent {
    static propTypes = {
        sidebarItem: PropTypes.object,
        items: PropTypes.array,
    };

    static defaultProps = {
        sidebarItem: {},
        items: [],
    };

    render() {
        const { items } = this.props;

        return (
            <Minifiable opened={filter(items, (item) => item.current).length !== 0} renderTitle={::this.renderTitle}>
                {map(items, ::this.renderLink)}
            </Minifiable>
        );
    }

    renderTitle({ onClick }) {
        return (
            <span onClick={onClick}>{Lang.get(`sidebar.items.${this.props.sidebarItem.menu || this.props.items[0]?.menu}`)}</span>
        );
    }

    renderLink(item, index) {
        return <LinkSidebarLayoutComponent key={index} item={item} />;
    }
}

SidebarLayoutComponent = withStatux(SidebarLayoutComponent, ['loggedIn']);

export default SidebarLayoutComponent;
