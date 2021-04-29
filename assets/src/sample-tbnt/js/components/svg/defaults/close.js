'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import SVG from '../svg';

import Styles from '../../../helpers/styles';

const AddSVG = (props) => {
    const { color, ...rest } = props;

    return (
        <SVG {...rest} width="512" height="512" className={toClassName(['svg--add', rest.className])}>
            <path
                fill={color}
                d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"
            />
        </SVG>
    );
};

AddSVG.propTypes = {
    color: PropTypes.string,
};

AddSVG.defaultProps = {
    color: Styles.get('black'),
};

export default React.memo(AddSVG);
