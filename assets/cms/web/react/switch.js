'use strict';

import filter from 'lodash/filter';
import kebabCase from 'lodash/kebabCase';
import map from 'lodash/map';
import noop from 'lodash/noop';
import trim from 'lodash/trim';
import snakeCase from 'lodash/snakeCase';

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

class RoutesSwitch extends React.Component {
    static propTypes = {
        onRoute: PropTypes.func,
        onUpdate: PropTypes.func,
        onShow: PropTypes.func,
        hideLoader: PropTypes.func,
        renderLoader: PropTypes.func,
        renderContent: PropTypes.func,
        renderBottom: PropTypes.func,
        renderError: PropTypes.func,
        renderNoMatch: PropTypes.func,
        data: PropTypes.object,
        cms: PropTypes.object,
        pages: PropTypes.object,
        loader: PropTypes.bool,
    };

    static defaultProps = {
        onRoute: noop,
        onUpdate: noop,
        onShow: noop,
        hideLoader: null,
        renderLoader: null,
        renderContent: null,
        renderBottom: null,
        renderError: null,
        renderNoMatch: null,
        data: {},
        cms: {},
        pages: {},
        loader: true,
    };

    state = {
        loader: this.props.loader,
        error: false,
    };

    componentDidMount() {
        this.addRoutes();
        this.hideLoader();
    }

    componentDidUpdate(prevProps) {
        this.props.onUpdate(prevProps, this.props);
    }

    addRoutes() {
        map(this.props.pages, (page, key) => this.addRoute(page, key));
    }

    addRoute(page, key, url = '/') {
        isObject(page) === false
            ? this.addPage(page, key, url)
            : map(page, (subpage, suburl) => this.addRoute(subpage, key, formatUrl([url, suburl])));
    }

    addPage(page, key, url = '/') {
        const post = this.props.cms.pages[snakeCase(key)];

        if (typeof page !== 'function' || !post) return;

        const route = {
            path: formatUrl([post.canonical[Laravel.langs?.current?.code], url]),
            component: page,
            key: kebabCase(key),
            exact: true,
            post,
        };

        routes.push(route);

        this.props.onRoute(route);
    }

    hideLoader() {
        if (this.props.hideLoader === null) this.showContent();
        else this.props.hideLoader({ showContent: ::this.showContent });
    }

    showContent() {
        this.setState({ loader: false }, ::this.props.onShow);
    }

    render() {
        return this.state.loader === true ? this.renderLoader() : this.renderContent();
    }

    renderLoader() {
        return this.props.renderLoader !== null ? this.props.renderLoader() : null;
    }

    renderContent() {
        if (this.state.error === true) return this.renderError();

        const { location } = this.props;

        if (this.props.renderContent !== null) return this.props.renderContent({ routes, location });

        return (
            <Switch key={location.key} location={location}>
                {filter(map(routes, ::this.renderRoute))}
                {this.props.renderBottom?.()}
                {this.renderNoMatch()}
            </Switch>
        );
    }

    renderRoute({ component: RouteComponent, ...rest }, index) {
        const renderRouteComponent = (props) => <RouteComponent {...props} />;

        return <Route {...rest} location={this.props.location} render={renderRouteComponent} />;
    }

    renderNoMatch() {
        if (this.state.loader === true || this.props.renderNoMatch === null) return null;

        return <Route render={this.props.renderNoMatch} />;
    }

    renderError() {
        return this.props.renderError?.() ?? <p>There was an error.</p>;
    }
}

const routes = [];

const formatUrl = (parts) => `/${filter(map(parts, (p) => trim(p, '/'))).join('/')}`;

const isObject = (value) => typeof value === 'object' && Array.isArray(value) === false;

export default RoutesSwitch;
