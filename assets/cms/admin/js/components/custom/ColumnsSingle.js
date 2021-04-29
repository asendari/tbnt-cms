'use strict';

import React from 'react';

import toClassName from 'lib/js/utils/toClassName';

import Columns from '../base/Columns';

const ColumnsSingleCustomComponent = (props) => {
    const { children, ...rest } = props;

    return (
        <Columns {...rest} className={toClassName(['columns-details', rest.className])}>
            {children}
        </Columns>
    );
};

ColumnsSingleCustomComponent.defaultProps = {
    cols: 1,
    gutter: 32,
};

export default React.memo(ColumnsSingleCustomComponent);
