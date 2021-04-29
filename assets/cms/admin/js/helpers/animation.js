'use strict';

import AnimationsConfig from '../config/animations';

import map from 'lodash/map';

class AnimationHelper {
    constructor(config) {
        map(config, (func, name) => {
            this[name] = func;
        });
    }
}

const Animation = new AnimationHelper(AnimationsConfig.get());

export default Animation;
