'use strict';

import React from 'react';

import Datetime from './Datetime';

const DateInputBaseComponent = (props) => {
    return <Datetime {...props} />;
};

DateInputBaseComponent.defaultProps = {
    type: 'date',
};

export default React.memo(DateInputBaseComponent);
