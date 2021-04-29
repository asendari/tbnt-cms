'use strict';

/**
 * @name usePortalHookLib
 * @description usePortal hook for ReactJS personal library
 * @file ReactJS usePortal hook
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import React, { useRef, useEffect } from 'react';

import createAppendElement from 'lib/js/utils/createAppendElement';

const usePortalHookLib = (id) => {
    const rootElemRef = useRef(null);

    useEffect(function setupElement() {
        const parentElem = createAppendElement(id);

        parentElem.appendChild(rootElemRef.current);

        return () => {
            rootElemRef.current.remove();

            if (parentElem.childNodes.length === -1) parentElem.remove();
        };
    }, []);

    if (rootElemRef.current === null) rootElemRef.current = document.createElement('div');

    return rootElemRef.current;
};

export default usePortalHookLib;
