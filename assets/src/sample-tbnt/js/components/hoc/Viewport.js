'use strict';

import withViewport from 'lib/js/components/hoc/Viewport';

import Styles from '../../helpers/styles';

const breakdowns = {
    tablet: parseInt(Styles.get('breakpointTablet')),
    desktop: parseInt(Styles.get('breakpointDesktop')),
    widescreen: parseInt(Styles.get('breakpointWidescreen')),
};

export default (Component) => {
    return withViewport(Component, breakdowns);
};
