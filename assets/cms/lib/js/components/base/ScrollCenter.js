'use strict';

/**
 * @name ScrollCenterBaseComponentLib
 * @description ScrollCenter base component for ReactJS personal library
 * @file ReactJS ScrollCenter Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';

import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

const ScrollCenterBaseComponentLib = (props) => {
    const { onRef, children, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    return (
        <div {...rest} className={toClassName(['scroll-center', rest.className])} ref={ref}>
            <div className="scroll-center--content">{children}</div>
        </div>
    );
};

export default React.memo(ScrollCenterBaseComponentLib);
