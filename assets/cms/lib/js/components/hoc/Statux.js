'use strict';

/**
 * @name StatuxHOCLib
 * @description Statux HOC for ReactJS personal library
 * @file ReactJS Statux HOC
 *
 * @version 1.1.1 - 2019-11-29
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import pick from 'lodash/pick';

import { events } from 'lib/js/helpers/statux';

export default (Component, statux, ev, filters = null) => {
    class StatuxHOCLib extends React.Component {
        handleRender(props) {
            return <Component {...this.props} statux={props} />;
        }

        render() {
            return <StatuxHOCComponentLib statux={statux} ev={ev} filters={filters} render={::this.handleRender} />;
        }
    }

    return StatuxHOCLib;
};

class StatuxHOCComponentLib extends React.Component {
    static propTypes = {
        render: PropTypes.func,
        statux: PropTypes.object.isRequired,
        ev: PropTypes.object.isRequired,
        filters: PropTypes.array,
    };

    static defaultProps = {
        render: noop,
        filters: null,
    };

    state = {
        statux: this.props.filters === null ? this.props.statux.get() : pick(this.props.statux.get(), this.props.filters),
    };

    events = {
        [events.UPDATE]: this.update,
    };

    componentWillUnmount() {
        this.props.ev.unbindMany(this.events, this);
    }

    componentDidMount() {
        this.props.ev.bindMany(this.events, this);
    }

    update(newState) {
        if (this.props.filters === null) {
            this.setState({ statux: newState });
        } else {
            if (isEqual(pick(this.state.statux, this.props.filters), pick(newState, this.props.filters)) === false) {
                this.setState({ statux: pick(newState, this.props.filters) });
            }
        }
    }

    setStatux(path, value) {
        this.props.statux.set(path, value);
    }

    getStatux(state, defaultValue) {
        return this.props.statux.get(state, defaultValue);
    }

    render() {
        return this.props.render({
            ...this.state.statux,
            set: ::this.setStatux,
            get: ::this.getStatux,
        });
    }
}
