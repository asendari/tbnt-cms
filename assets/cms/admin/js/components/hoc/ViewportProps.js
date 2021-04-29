'use strict';

import withViewport from './Viewport';
import withViewportProps from 'lib/js/components/hoc/ViewportProps';

const breakpointsToViewports = {
    mobile: ['s', 'm'],
    tablet: ['s', 'm', 't', 'to'],
    desktop: ['s', 't', 'd'],
    widescreen: ['s', 't', 'd', 'w'],
};

export default (Component, viewportedProps = null) => {
    return withViewportProps(withViewport, Component, breakpointsToViewports, viewportedProps);
};
