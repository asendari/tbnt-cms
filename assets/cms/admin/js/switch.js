'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import camelCase from 'lodash/camelCase';
import filter from 'lodash/filter';
import kebabCase from 'lodash/kebabCase';
import lowerFirst from 'lodash/lowerFirst';
import map from 'lodash/map';
import noop from 'lodash/noop';
import upperFirst from 'lodash/upperFirst';

import Lang from './helpers/lang';

class RoutesSwitch extends React.Component {
    static propTypes = {
        onUpdate: PropTypes.func,
        onShow: PropTypes.func,
        hideLoader: PropTypes.func,
        renderLoader: PropTypes.func,
        renderContent: PropTypes.func,
        renderBottom: PropTypes.func,
        renderError: PropTypes.func,
        renderNoMatch: PropTypes.func,
        data: PropTypes.object,
        pages: PropTypes.object,
        loader: PropTypes.bool,
    };

    static defaultProps = {
        onUpdate: noop,
        onShow: noop,
        hideLoader: null,
        renderLoader: null,
        renderContent: null,
        renderBottom: null,
        renderError: null,
        renderNoMatch: null,
        data: {},
        pages: {},
        loader: true,
    };

    state = {
        loader: this.props.loader,
        error: false,
    };

    componentDidMount() {
        this.hideLoader();
    }

    componentDidUpdate(prevProps) {
        this.props.onUpdate(prevProps, this.props);
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
                {filter(map(this.props.pages, ::this.renderRoute))}
                {this.props.renderBottom?.()}
                {this.renderNoMatch()}
            </Switch>
        );
    }

    renderRoute(page, key) {
        const route = { path: Lang.router(key), component: page, exact: true, key };

        if (route.path === Lang.defaultText) return;

        const { component: RouteComponent, ...rest } = route;

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

export default RoutesSwitch;
