'use strict';

import React from 'react';

import withAnimations from '../hoc/Animations';

import Anchor from 'lib/js/components/base/Anchor';

const AnchorBaseComponent = (props) => {
    const { animations, ...rest } = props;

    const animate = (top, anchor) => animations.scrollTo(window, 0);

    return <Anchor {...rest} animate={animate} />;
};

export default React.memo(withAnimations(AnchorBaseComponent));
