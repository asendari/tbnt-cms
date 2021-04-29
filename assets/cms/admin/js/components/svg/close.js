'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import SVG from './svg';

import Styles from '../../helpers/styles';

const CloseSVG = (props) => {
    const { color, ...rest } = props;

    return (
        <SVG {...rest} className={toClassName(['svg--close', rest.className])}>
            <path
                className="svg--anim"
                fill={color}
                d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"
            />
        </SVG>
    );
};

CloseSVG.propTypes = {
    color: PropTypes.string,
};

CloseSVG.defaultProps = {
    color: Styles.get('text'),
};

export default React.memo(CloseSVG);
