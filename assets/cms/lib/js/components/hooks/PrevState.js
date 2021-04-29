'use strict';

/**
 * @name usePrevStateHookLib
 * @description usePrevState hook for ReactJS personal library
 * @file ReactJS usePrevState hook
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import React, { useRef, useEffect } from 'react';

const usePrevStateHookLib = (state) => {
    const prevStateRef = useRef();

    useEffect(() => {
        prevStateRef.current = state;
    });

    return prevStateRef.current;
};

export default usePrevStateHookLib;
