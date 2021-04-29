'use strict';

/**
 * @name ViewportPropsHOCLib
 * @description ViewportProps HOC for ReactJS personal library
 * @file ReactJS ViewportProps HOC
 *
 * @version 1.1.1 - 2019-11-29
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import flatten from 'lodash/flatten';
import keys from 'lodash/keys';
import intersection from 'lodash/intersection';
import mapValues from 'lodash/mapValues';
import noop from 'lodash/noop';
import uniq from 'lodash/uniq';
import values from 'lodash/values';

import isObject from 'lib/js/utils/isObject';

export default (withViewport, Component, breakpointsToViewports, viewportedProps = null) => {
    const viewports = uniq(flatten(values(breakpointsToViewports)));

    ViewportPropsHOCComponentLib = withViewport(ViewportPropsHOCComponentLib);

    class ViewportPropsHOCLib extends React.Component {
        handleRender(props) {
            return <Component {...props} />;
        }

        render() {
            return (
                <ViewportPropsHOCComponentLib
                    props={this.props}
                    defaultProps={Component.defaultProps}
                    breakpointsToViewports={breakpointsToViewports}
                    viewports={viewports}
                    viewportedProps={viewportedProps}
                    render={::this.handleRender}
                />
            );
        }
    }

    return ViewportPropsHOCLib;
};

class ViewportPropsHOCComponentLib extends React.Component {
    static propTypes = {
        render: PropTypes.func,
        props: PropTypes.object.isRequired,
        breakpointsToViewports: PropTypes.object.isRequired,
        viewports: PropTypes.array.isRequired,
        viewportedProps: PropTypes.array,
        defaultProps: PropTypes.object,
    };

    static defaultProps = {
        render: noop,
        viewportedProps: null,
        defaultProps: {},
    };

    render() {
        const { props, defaultProps, viewport, viewports, viewportedProps, breakpointsToViewports } = this.props;

        const filterProps = viewportedProps ?? keys(props);

        const propsFiltered = mapValues(props, (prop, key) => {
            if (filterProps.indexOf(key) === -1 || isObject(prop) === false || intersection(keys(prop), viewports).length === 0)
                return prop;

            for (var i = breakpointsToViewports[viewport].length - 1; i >= 0; i--) {
                if (prop[breakpointsToViewports[viewport][i]] !== undefined) return prop[breakpointsToViewports[viewport][i]];
            }

            return defaultProps[key] ?? null;
        });

        return this.props.render(propsFiltered);
    }
}
