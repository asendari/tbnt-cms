'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import SVG from './svg';

import Styles from '../../helpers/styles';

const ArrowDownSVG = (props) => {
    const { color, ...rest } = props;

    return (
        <SVG {...rest} className={toClassName(['svg--arrow-down', rest.className])}>
            <path
                className="svg--anim"
                fill={color}
                d="M277.375 85v259.704l119.702-119.702L427 256 256 427 85 256l29.924-29.922 119.701 118.626V85h42.75z"
            />
        </SVG>
    );
};

ArrowDownSVG.propTypes = {
    color: PropTypes.string,
};

ArrowDownSVG.defaultProps = {
    color: Styles.get('text'),
};

export default React.memo(ArrowDownSVG);
