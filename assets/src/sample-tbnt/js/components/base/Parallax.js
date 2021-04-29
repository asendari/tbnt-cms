'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import Parallax from 'lib/js/components/base/Parallax';

import EffectConfig from '../../config/effect';

const ParallaxBaseComponent = (props) => {
    const { active, ...rest } = props;

    return <Parallax {...rest} active={active && EffectConfig.get('parallax.active')} />;
};

ParallaxBaseComponent.propTypes = {
    active: PropTypes.bool,
};

ParallaxBaseComponent.defaultProps = {
    active: true,
};

export default React.memo(ParallaxBaseComponent);
