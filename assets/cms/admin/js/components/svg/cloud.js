'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import SVG from './svg';

import Styles from '../../helpers/styles';

const CloudSVG = (props) => {
    const { color, ...rest } = props;

    return (
        <SVG {...rest} className={toClassName(['svg--cloud', rest.className])}>
            <path
                className="svg--anim"
                fill="none"
                stroke={color}
                strokeLinejoin="round"
                strokeWidth="40px"
                d="M400,240c-8.89-89.54-71-144-144-144-69,0-113.44,48.2-128,96C68,198,16,235.59,16,304c0,66,54,112,120,112H396c55,0,100-27.44,100-88C496,268.18,443,242.24,400,240Z"
            />
        </SVG>
    );
};

CloudSVG.propTypes = {
    color: PropTypes.string,
};

CloudSVG.defaultProps = {
    color: Styles.get('text'),
};

export default React.memo(CloudSVG);
