'use strict';

/**
 * @name ScrollInvisibleBaseComponentLib
 * @description ScrollInvisible base component for ReactJS personal library
 * @file ReactJS ScrollInvisible Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';

import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

const ScrollInvisibleBaseComponentLib = (props) => {
    const { onRef, children, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    return (
        <div {...rest} className={toClassName(['scroll-invisible', className])} ref={ref}>
            <div className="scroll-invisible--content">{children}</div>
        </div>
    );
};

export default React.memo(ScrollInvisibleBaseComponentLib);
