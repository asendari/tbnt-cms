'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import SVG from './svg';

import Styles from '../../helpers/styles';

const ArrowUpSVG = (props) => {
    const { color, ...rest } = props;

    return (
        <SVG {...rest} className={toClassName(['svg--arrow-up', rest.className])}>
            <path
                className="svg--anim"
                fill={color}
                d="M277.375 427V167.296l119.702 119.702L427 256 256 85 85 256l29.924 29.922 119.701-118.626V427h42.75z"
            />
        </SVG>
    );
};

ArrowUpSVG.propTypes = {
    color: PropTypes.string,
};

ArrowUpSVG.defaultProps = {
    color: Styles.get('text'),
};

export default React.memo(ArrowUpSVG);
