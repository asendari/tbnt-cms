'use strict';

/**
 * @name AlertBaseComponentLib
 * @description Alert base component for ReactJS personal library
 * @file ReactJS Alert Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

const AlertBaseComponentLib = (props) => {
    const { onRef, type, children, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    return (
        <div {...rest} className={toClassName(['alert', `--${type}`, rest.className])} ref={ref}>
            <span className="alert--content">{children}</span>
        </div>
    );
};

AlertBaseComponentLib.propTypes = {
    type: PropTypes.string,
};

AlertBaseComponentLib.defaultProps = {
    type: 'default',
};

export default React.memo(AlertBaseComponentLib);
