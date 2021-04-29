'use strict';

/**
 * @name AnchorBaseComponentLib
 * @description Anchor base component for ReactJS personal library
 * @file ReactJS Anchor Component
 *
 * @version 1.3.1 - 2020-06-29
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import call from 'lib/js/utils/call';
import isString from 'lib/js/utils/isString';
import toClassName from 'lib/js/utils/toClassName';

import withFastdom from 'lib/js/components/hoc/Fastdom';

import useOnRef from 'lib/js/components/hooks/OnRef';

const AnchorBaseComponentLib = (props) => {
    const { fastdom, animate, onRef, anchor, children, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    const handleAnchor = () => {
        const $anchor = (isString(anchor) === true ? document.querySelector(anchor) : anchor) || null;

        if ($anchor !== null)
            fastdom.measure(() => (animate ? call(animate, $anchor.offsetTop, $anchor) : window.scrollTo(0, $anchor.offsetTop)));
    };

    return (
        <div {...rest} className={toClassName(['anchor', rest.className])} onClick={handleAnchor} ref={ref}>
            {children}
        </div>
    );
};

AnchorBaseComponentLib.propTypes = {
    animate: PropTypes.func,
    anchor: PropTypes.node,
};

AnchorBaseComponentLib.defaultProps = {
    animate: null,
    anchor: null,
};

export default React.memo(withFastdom(AnchorBaseComponentLib));
