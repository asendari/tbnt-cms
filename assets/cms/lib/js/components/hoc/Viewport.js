'use strict';

/**
 * @name ViewportHOCLib
 * @description Viewport HOC for ReactJS personal library
 * @file ReactJS Viewport HOC
 *
 * @version 1.1.1 - 2019-11-29
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import withFastdom from 'lib/js/components/hoc/Fastdom';
import withResizeEvent from 'lib/js/components/hoc/ResizeEvent';

export default (Component, breakdowns) => {
    class ViewportHOCLib extends React.Component {
        handleRender(props) {
            return <Component {...this.props} viewport={props} />;
        }

        render() {
            return <ViewportHOCComponentLib breakdowns={breakdowns} render={::this.handleRender} />;
        }
    }

    return ViewportHOCLib;
};

class ViewportHOCComponentLib extends React.Component {
    static propTypes = {
        render: PropTypes.func,
        breakdowns: PropTypes.object.isRequired,
    };

    static defaultProps = {
        render: noop,
    };

    state = {
        viewport: this.getViewport(),
    };

    fastdomRef = null;

    componentDidMount() {
        this.props.resizeEvent.add(::this.onResize);
    }

    onResize() {
        this.props.fastdom.clear(this.fastdomRef);

        this.fastdomRef = this.props.fastdom.measure(() => {
            const viewport = this.getViewport();
            if (viewport !== this.state.viewport) this.setState({ viewport });
        });
    }

    getViewport() {
        const windowWidth = window.innerWidth;

        return windowWidth < this.props.breakdowns.tablet
            ? 'mobile'
            : windowWidth < this.props.breakdowns.desktop
            ? 'tablet'
            : windowWidth < this.props.breakdowns.widescreen
            ? 'desktop'
            : 'widescreen';
    }

    render() {
        return this.props.render(this.state.viewport);
    }
}

ViewportHOCComponentLib = withFastdom(ViewportHOCComponentLib);
ViewportHOCComponentLib = withResizeEvent(ViewportHOCComponentLib);
