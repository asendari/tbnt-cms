'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';

import noop from 'lodash/noop';

import Dialog from '../../helpers/dialog';
import History from '../../helpers/history';

export class RouteLeavingGuard extends React.Component {
    static propTypes = {
        message: PropTypes.func,
    };

    static defaultProps = {
        message: noop,
    };

    state = {
        when: true,
    };

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.when !== nextState.when;
    }

    handleNavigation(nextLocation, action) {
        if (this.state.when === false || action.toLowerCase() === 'pop') return true;

        const message = this.props.message();

        if (message === true) return true;

        Dialog.confirm(message, {
            onAccept: () => this.setState({ when: false }, () => History.push(nextLocation)),
        });

        return false;
    }

    render() {
        return <Prompt when={this.state.when} message={::this.handleNavigation} />;
    }
}

export default RouteLeavingGuard;
