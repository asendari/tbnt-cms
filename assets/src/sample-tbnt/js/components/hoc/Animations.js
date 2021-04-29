'use strict';

import withAnimations from 'lib/js/components/hoc/Animations';

import AnimationsConfig from '../../config/animations';

export default (Component) => {
    return withAnimations(Component, AnimationsConfig.get());
};
