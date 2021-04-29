'use strict';

import withStatux from 'lib/js/components/hoc/Statux';

import ev from '../../helpers/event';
import Statux from '../../helpers/statux';

export default (Component, filters = null) => {
    return withStatux(Component, Statux, ev, filters);
};
