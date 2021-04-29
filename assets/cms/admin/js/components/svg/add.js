'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import SVG from './svg';

import Styles from '../../helpers/styles';

const AddSVG = (props) => {
    const { color, ...rest } = props;

    return (
        <SVG {...rest} className={toClassName(['svg--add', rest.className])}>
            <path
                className="svg--anim"
                fill={color}
                d="M416 277.333H277.333V416h-42.666V277.333H96v-42.666h138.667V96h42.666v138.667H416v42.666z"
            />
        </SVG>
    );
};

AddSVG.propTypes = {
    color: PropTypes.string,
};

AddSVG.defaultProps = {
    color: Styles.get('text'),
};

export default React.memo(AddSVG);
