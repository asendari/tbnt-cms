'use strict';

import React from 'react';

import Wysiwyg from 'lib/js/components/base/Input/Wysiwyg';

import AppConfig from '../../../config/app';

const WysiwygInputBaseComponent = (props) => {
    return <Wysiwyg {...props} />;
};

WysiwygInputBaseComponent.defaultProps = {
    toolbarButtons: ['bold', 'italic', 'underline', 'strike', { script: 'sub' }, { script: 'super' }, 'link', 'clean'],
    debug: AppConfig.get('dev') === true ? 'warn' : false,
};

export default React.memo(WysiwygInputBaseComponent);
