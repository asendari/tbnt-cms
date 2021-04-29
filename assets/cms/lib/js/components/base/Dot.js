'use strict';

/**
 * @name DotBaseComponentLib
 * @description Dot base component for ReactJS personal library
 * @file ReactJS Dot Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

const DotBaseComponentLib = (props) => {
    const { onRef, type, children, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    return (
        <div {...rest} className={toClassName(['dot', `--${type}`, rest.className])} ref={ref}>
            <div className="dot--content">{children}</div>
        </div>
    );
};

DotBaseComponentLib.propTypes = {
    type: PropTypes.string,
};

DotBaseComponentLib.defaultProps = {
    type: 'default',
};

export default React.memo(DotBaseComponentLib);
