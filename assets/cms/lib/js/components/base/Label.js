'use strict';

/**
 * @name LabelBaseComponentLib
 * @description Label base component for ReactJS personal library
 * @file ReactJS Label Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

const LabelBaseComponentLib = (props) => {
    const { onRef, type, children, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    return (
        <div {...rest} className={toClassName(['label', `--${type}`, rest.className])} ref={ref}>
            <span className="label--content">{children}</span>
        </div>
    );
};

LabelBaseComponentLib.propTypes = {
    type: PropTypes.string,
};

LabelBaseComponentLib.defaultProps = {
    type: 'default',
};

export default React.memo(LabelBaseComponentLib);
