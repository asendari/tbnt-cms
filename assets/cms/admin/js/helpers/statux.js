'use strict';

import StatuxHelper from 'lib/js/helpers/statux';

import StatuxConfig from '../config/statux';

const Statux = new StatuxHelper(StatuxConfig.get());

export default Statux;
