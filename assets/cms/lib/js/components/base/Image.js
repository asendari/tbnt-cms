'use strict';

/**
 * @name ImageBaseComponentLib
 * @description Image base component for ReactJS personal library
 * @file ReactJS Image Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

const ImageBaseComponentLib = (props) => {
    const { onRef, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    return <img {...rest} className={toClassName(['image', rest.className])} ref={ref} />;
};

ImageBaseComponentLib.propTypes = {
    alt: PropTypes.string,
};

ImageBaseComponentLib.defaultProps = {
    alt: '',
};

export default React.memo(ImageBaseComponentLib);
