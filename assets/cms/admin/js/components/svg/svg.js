'use strict';

import React from 'react';

import toClassName from 'lib/js/utils/toClassName';

const SVG = (props) => {
    const { children, ...rest } = props;

    return (
        <svg
            width="16px"
            height="16px"
            viewBox="0 0 512 512"
            {...rest}
            style={{ width: 20, ...rest.style }}
            className={toClassName(['svg', rest.className])}
        >
            {children}
        </svg>
    );
};

export default React.memo(SVG);
