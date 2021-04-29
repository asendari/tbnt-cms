'use strict';

import React from 'react';

import toClassName from 'lib/js/utils/toClassName';

import Columns from '../base/Columns';

const ColumnsDoubleCustomComponent = (props) => {
    const { children, ...rest } = props;

    return (
        <Columns {...rest} className={toClassName(['columns-details', rest.className])}>
            {children}
        </Columns>
    );
};

ColumnsDoubleCustomComponent.defaultProps = {
    cols: { s: 1, t: 2 },
    gutter: 32,
};

export default React.memo(ColumnsDoubleCustomComponent);
