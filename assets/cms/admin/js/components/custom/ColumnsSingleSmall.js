'use strict';

import React from 'react';

import toClassName from 'lib/js/utils/toClassName';

import Columns from '../base/Columns';

const ColumnsSingleSmallCustomComponent = (props) => {
    const { children, ...rest } = props;

    return (
        <Columns {...rest} className={toClassName(['columns-inputs', rest.className])}>
            {children}
        </Columns>
    );
};

ColumnsSingleSmallCustomComponent.defaultProps = {
    cols: 1,
    gutter: 24,
};

export default React.memo(ColumnsSingleSmallCustomComponent);
