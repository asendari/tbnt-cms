'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import call from 'lib/js/utils/call';
import isNavigator from 'lib/js/utils/isNavigator';

const isIE = isNavigator.ie();

export default (Component) => {
    class TransitionHOC extends React.Component {
        handleRender(props) {
            return <Component {...this.props} />;
        }

        render() {
            return <TransitionHOCComponent render={::this.handleRender} />;
        }
    }

    return TransitionHOC;
};

class TransitionHOCComponent extends React.Component {
    static propTypes = {
        render: PropTypes.func,
    };

    static defaultProps = {
        render: noop,
    };

    componentDidMount() {
        this.$page = document.querySelector('.page--container');
    }

    componentWillAppear(cb) {
        cb();
    }

    componentWillEnter(cb) {
        cb();
    }

    componentWillLeave(cb) {
        cb();
    }

    doSafe(cb, animate) {
        if (isIE === true) return cb();

        call(animate);
    }

    render() {
        return this.props.render();
    }
}
