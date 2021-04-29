'use strict';

import React from 'react';

import PaginationServer from 'lib/js/components/base/PaginationServer';

import withServer from '../hoc/Server';

import Cache from '../../helpers/cache';

const PaginationServerBaseComponent = (props) => {
    return <PaginationServer {...props} cache={Cache} />;
};

export default React.memo(withServer(PaginationServerBaseComponent));
