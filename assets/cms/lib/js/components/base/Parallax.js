'use strict';

/**
 * @name ParallaxBaseComponentLib
 * @description Parallax base component for ReactJS personal library
 * @file ReactJS Parallax Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

import Parallax from 'lib/js/plugins/parallax';

const ParallaxBaseComponentLib = (props) => {
    const { onRef, parallax, active, children, ...rest } = props;

    const ref = useRef(null);

    const pa = useRef(null);

    const isActive = useRef(false);

    useOnRef(onRef, { ref });

    useEffect(() => {
        if (isActive.current === false && active === true) activate();
        else if (isActive.current === true && active === false) inactivate();

        return () => {
            inactivate();
        };
    });

    const inactivate = () => pa.current?.destroy();

    const activate = () => {
        inactivate();

        pa.current = new Parallax({ ...parallax, target: ref.current });
    };

    return (
        <div {...rest} className={toClassName(['parallax', rest.className])} ref={ref}>
            {children}
        </div>
    );
};

ParallaxBaseComponentLib.propTypes = {
    parallax: PropTypes.object,
    active: PropTypes.bool,
};

ParallaxBaseComponentLib.defaultProps = {
    parallax: {},
    active: true,
};

export default React.memo(ParallaxBaseComponentLib);
