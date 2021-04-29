'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

const SVG = (props) => {
    const { width, height, children, ...rest } = props;

    return (
        <svg
            {...rest}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            version="1.1"
            className={toClassName(['svg', rest.className])}
            xmlns="http://www.w3.org/2000/svg"
        >
            {children}
        </svg>
    );
};

SVG.propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

SVG.defaultProps = {
    width: 0,
    height: 0,
};

export default React.memo(SVG);
