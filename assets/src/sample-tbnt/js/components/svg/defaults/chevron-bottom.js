'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import SVG from '../svg';

import Styles from '../../../helpers/styles';

const ChevronBottomSVG = (props) => {
    const { color, ...rest } = props;

    return (
        <SVG {...rest} width="512" height="512" className={toClassName(['svg--chevron-bottom', rest.className])}>
            <path
                fill={color}
                d="M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z"
            />
        </SVG>
    );
};

ChevronBottomSVG.propTypes = {
    color: PropTypes.string,
};

ChevronBottomSVG.defaultProps = {
    color: Styles.get('black'),
};

export default React.memo(ChevronBottomSVG);
