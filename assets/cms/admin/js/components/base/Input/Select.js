'use strict';

import React from 'react';

import Select from 'lib/js/components/base/Input/Select';

import Lang from '../../../helpers/lang';

const SelectInputBaseComponent = (props) => {
    const { placeholder, ...rest } = props;

    return <Select {...rest} placeholder={placeholder ?? Lang.get('inputs.empty')} />;
};

export default React.memo(SelectInputBaseComponent);
