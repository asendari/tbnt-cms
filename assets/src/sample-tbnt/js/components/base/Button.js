'use strict';

import React from 'react';

import toClassName from 'lib/js/utils/toClassName';

import Link from './Link';

const ButtonBaseComponent = (props) => {
    return <Link {...props} className={toClassName(['--button', props.className])} />;
};

export default React.memo(ButtonBaseComponent);
