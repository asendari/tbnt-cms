'use strict';

/**
 * @name useOnRefHookLib
 * @description useOnRef hook for ReactJS personal library
 * @file ReactJS useOnRef hook
 *
 * @version 1.0.0 - 2019-12-04
 * @author Alexandre Pilloud
 */

import React, { useEffect } from 'react';

import call from 'lib/js/utils/call';

const useOnRefHookLib = (cb, state = {}) => {
    useEffect(() => {
        callRef(cb, state);
    });
};

export const callRef = (cb, state) => call(cb, state);

export default useOnRefHookLib;
