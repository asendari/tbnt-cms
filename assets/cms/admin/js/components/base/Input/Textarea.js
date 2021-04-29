'use strict';

import React from 'react';

import Textarea from 'lib/js/components/base/Input/Textarea';

const TextareaInputBaseComponent = (props) => {
    return <Textarea {...props} />;
};

TextareaInputBaseComponent.defaultProps = {
    minRows: 3,
};

export default React.memo(TextareaInputBaseComponent);
