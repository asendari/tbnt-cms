'use strict';

/**
 * @name ButtonBaseComponentLib
 * @description Button base component for ReactJS personal library
 * @file ReactJS Button Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

const ButtonBaseComponentLib = (props) => {
    const { onRef, loader, disabled, loadingText, children, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    return (
        <button
            {...rest}
            className={toClassName(['button', loader && '--loading', disabled && '--disabled', rest.className])}
            disabled={disabled || loader}
            ref={ref}
        >
            {loader === true ? loadingText ?? children : children}
        </button>
    );
};

ButtonBaseComponentLib.propTypes = {
    loader: PropTypes.bool,
    disabled: PropTypes.bool,
    loadingText: PropTypes.node,
};

ButtonBaseComponentLib.defaultProps = {
    loader: false,
    disabled: false,
    loadingText: null,
};

export default React.memo(ButtonBaseComponentLib);
