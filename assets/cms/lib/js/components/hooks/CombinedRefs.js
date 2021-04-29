'use strict';

/**
 * @name useCombinedRefsHookLib
 * @description useCombinedRefs hook for ReactJS personal library
 * @file ReactJS useCombinedRefs hook
 *
 * @version 1.0.0 - 2019-11-29
 * @author Alexandre Pilloud
 */

import React, { useRef, useEffect } from 'react';

const useCombinedRefsHookLib = (...refs) => {
    const targetRef = useRef();

    useEffect(() => {
        refs.forEach((ref) => {
            if (!ref) return;
            else if (typeof ref === 'function') ref(targetRef.current);
            else ref.current = targetRef.current;
        });
    }, [refs]);

    return targetRef;
};

export default useCombinedRefsHookLib;
