'use strict';

/**
 * @name PlaceholderBaseComponentLib
 * @description Placeholder base component for ReactJS personal library
 * @file ReactJS Placeholder Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import createObserver from 'lib/js/utils/createObserver';
import setCss from 'lib/js/utils/setCss';
import toClassName from 'lib/js/utils/toClassName';

import withFastdom from 'lib/js/components/hoc/Fastdom';

import useOnRef from 'lib/js/components/hooks/OnRef';

const PlaceholderBaseComponentLib = (props) => {
    const { fastdom, onRef, listen, children, ...rest } = props;

    const ref = useRef(null);

    const ro = useRef(null);

    useOnRef(onRef, { ref });

    useEffect(() => {
        if (listen !== null) {
            if (ro.current === null) ro.current = createObserver(updatePlaceholder);

            ro.current.disconnect();
            ro.current.observe(listen);

            updatePlaceholder();
        }

        return () => {
            ro.current && ro.current.disconnect();
        };
    });

    const updatePlaceholder = (entries, observer) =>
        fastdom.measure(() => {
            const rect = getRect();

            fastdom.mutate(() => rect && setRect(rect));
        });

    const getRect = () => (listen === null ? null : listen.getBoundingClientRect());

    const setRect = (rect) =>
        ref.current !== null &&
        rect !== null &&
        setCss(ref.current, {
            width: `${rect.width}px`,
            height: `${rect.height}px`,
        });

    return (
        <>
            <div {...rest} className={toClassName(['placeholder', rest.className])} ref={ref} />

            {children}
        </>
    );
};

PlaceholderBaseComponentLib.propTypes = {
    listen: PropTypes.instanceOf(Element),
};

PlaceholderBaseComponentLib.defaultProps = {
    listen: null,
};

export default React.memo(withFastdom(PlaceholderBaseComponentLib));
