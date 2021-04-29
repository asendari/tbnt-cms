'use strict';

import React from 'react';

import SelectMultiple from 'lib/js/components/base/Input/SelectMultiple';

import Lang from '../../../helpers/lang';

const SelectMultipleInputBaseComponent = (props) => {
    const { placeholder, ...rest } = props;

    return <SelectMultiple {...rest} placeholder={placeholder ?? Lang.get('inputs.empty')} />;
};

export default React.memo(SelectMultipleInputBaseComponent);
