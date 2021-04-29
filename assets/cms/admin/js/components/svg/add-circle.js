'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import SVG from './svg';

import Styles from '../../helpers/styles';

const AddCircleSVG = (props) => {
    const { color, ...rest } = props;

    return (
        <SVG {...rest} className={toClassName(['svg--add-circle', rest.className])}>
            <path
                className="svg--anim"
                fill={color}
                d="M256 48C141.125 48 48 141.125 48 256s93.125 208 208 208 208-93.125 208-208S370.875 48 256 48zm107 229h-86v86h-42v-86h-86v-42h86v-86h42v86h86v42z"
            />
        </SVG>
    );
};

AddCircleSVG.propTypes = {
    color: PropTypes.string,
};

AddCircleSVG.defaultProps = {
    color: Styles.get('text'),
};

export default React.memo(AddCircleSVG);
