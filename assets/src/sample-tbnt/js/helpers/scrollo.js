'use strict';

import ScrolloPlugin from 'lib/js/plugins/scrollo';

import EffectConfig from '../config/effect';

const Scrollo = EffectConfig.get('scrollo.active') === true ? new ScrolloPlugin(EffectConfig.get('scrollo.config')) : null;

export default Scrollo;
