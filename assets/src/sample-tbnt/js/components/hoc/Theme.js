'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import withEvent from 'lib/js/components/hoc/Event';

import noop from 'lodash/noop';

import Params from '../../helpers/params';

export default (Component) => {
    class ThemeHOC extends React.Component {
        handleRender(props) {
            return <Component {...this.props} theme={props} />;
        }

        render() {
            return <ThemeHOCComponent render={::this.handleRender} />;
        }
    }

    return ThemeHOC;
};

class ThemeHOCComponent extends React.Component {
    static propTypes = {
        render: PropTypes.func,
    };

    static defaultProps = {
        render: noop,
    };

    state = {
        theme: Params.get('theme'),
    };

    mounted = true;

    #onThemeUpdated = ::this.onThemeUpdated;

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidMount() {
        this.props.event.add('theme:updated', this.#onThemeUpdated);
    }

    onThemeUpdated(theme) {
        if (this.mounted === true) this.setState({ theme });
    }

    render() {
        return this.props.render(this.state.theme);
    }
}

ThemeHOCComponent = withEvent(ThemeHOCComponent);
