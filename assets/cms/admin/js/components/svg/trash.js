'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import SVG from './svg';

import Styles from '../../helpers/styles';

const TrashSVG = (props) => {
    const { color, ...rest } = props;

    return (
        <SVG {...rest} className={toClassName(['svg--trash', rest.className])}>
            <path
                className="svg--anim"
                fill={color}
                d="M128 405.429C128 428.846 147.198 448 170.667 448h170.667C364.802 448 384 428.846 384 405.429V160H128v245.429zM416 96h-80l-26.785-32H202.786L176 96H96v32h320V96z"
            />
        </SVG>
    );
};

TrashSVG.propTypes = {
    color: PropTypes.string,
};

TrashSVG.defaultProps = {
    color: Styles.get('text'),
};

export default React.memo(TrashSVG);
