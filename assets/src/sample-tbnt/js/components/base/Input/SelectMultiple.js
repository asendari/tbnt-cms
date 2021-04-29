'use strict';

import React from 'react';

import SelectMultiple from 'lib/js/components/base/Input/SelectMultiple';

import Lang from '../../../helpers/lang';

const SelectMultipleInputBaseComponent = (props) => {
    const { placeholder, loadingPlaceholder, ...rest } = props;

    return (
        <SelectMultiple
            {...rest}
            placeholder={placeholder ?? Lang.get('modules.words.select')}
            loadingPlaceholder={loadingPlaceholder ?? Lang.get('modules.words.loading_dot')}
        />
    );
};

export default React.memo(SelectMultipleInputBaseComponent);
