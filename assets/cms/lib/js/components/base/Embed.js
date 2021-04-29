'use strict';

/**
 * @name EmbedBaseComponentLib
 * @description Embed base component for ReactJS personal library
 * @file ReactJS Embed Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

const EmbedBaseComponentLib = (props) => {
    const { onRef, src, srcProps, ratio, children, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    return (
        <div {...rest} className={toClassName(['embed', `ratio-${ratio}`, rest.className])} ref={ref}>
            <div className="embed--content ratio-child">
                <iframe {...srcProps} src={src} />
            </div>
        </div>
    );
};

EmbedBaseComponentLib.propTypes = {
    src: PropTypes.string,
    srcProps: PropTypes.object,
    ratio: PropTypes.string,
};

EmbedBaseComponentLib.defaultProps = {
    src: '',
    srcProps: {},
    ratio: '4-3',
};

export default React.memo(EmbedBaseComponentLib);
