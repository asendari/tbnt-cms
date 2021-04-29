'use strict';

/**
 * @name ServerHOCLib
 * @description Server HOC for ReactJS personal library
 * @file ReactJS Server HOC
 *
 * @version 1.1.1 - 2019-11-29
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import noop from 'lodash/noop';
import once from 'lodash/once';

import uniqId from 'lib/js/utils/uniqId';

export default (Component, server) => {
    class ServerHOCLib extends React.Component {
        handleRender(props) {
            return <Component {...this.props} server={props} />;
        }

        render() {
            return <ServerHOCComponentLib server={server} render={::this.handleRender} />;
        }
    }

    return ServerHOCLib;
};

class ServerHOCComponentLib extends React.Component {
    static propTypes = {
        render: PropTypes.func,
        server: PropTypes.object.isRequired,
    };

    static defaultProps = {
        render: noop,
    };

    fetches = {};

    componentWillUnmount() {
        this.clearAll();
    }

    fetch(url, options = {}) {
        options.ref = uniqId();

        this.add(options.ref);

        this.props.server.fetch(url, this.decorateCallbacks(options));
    }

    add(fetchId) {
        this.fetches[fetchId] = fetchId;
    }

    clear(fetchId) {
        this.props.server.abort(fetchId);

        delete this.fetches[fetchId];
    }

    clearAll() {
        map(this.fetches, (fetchId) => this.clear(fetchId));
    }

    decorateCallbacks(options) {
        if (options.success !== undefined) {
            const onSuccess = options.success;
            options.success = once((...args) => {
                if (this.fetches[options.ref] !== undefined) onSuccess(...args);
            });
        }

        if (options.error !== undefined) {
            const onError = options.error;
            options.error = once((...args) => {
                if (this.fetches[options.ref] !== undefined) onError(...args);
            });
        }

        if (options.complete !== undefined) {
            const onComplete = options.complete;
            options.complete = once((...args) => {
                if (this.fetches[options.ref] !== undefined) onComplete(...args);
            });
        }

        return options;
    }

    render() {
        return this.props.render({
            fetch: ::this.fetch,
            clear: ::this.clear,
            clearAll: ::this.clearAll,
        });
    }
}
