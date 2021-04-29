'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import SVG from './svg';

import Styles from '../../helpers/styles';

const MenuSVG = (props) => {
    const { color, ...rest } = props;

    return (
        <SVG {...rest} className={toClassName(['svg--menu', rest.className])}>
            <path
                className="svg--anim"
                fill={color}
                d="M64 384h384v-42.666H64V384zm0-106.666h384v-42.667H64v42.667zM64 128v42.665h384V128H64z"
            />
        </SVG>
    );
};

MenuSVG.propTypes = {
    color: PropTypes.string,
};

MenuSVG.defaultProps = {
    color: Styles.get('text'),
};

export default React.memo(MenuSVG);
