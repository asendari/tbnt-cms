'use strict';

/**
 * @name CoverBaseComponentLib
 * @description Cover base component for ReactJS personal library
 * @file ReactJS Cover Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import merge from 'lodash/merge';

import addStyle from 'lib/js/utils/addStyle';
import isColor from 'lib/js/utils/isColor';
import removeStyle from 'lib/js/utils/removeStyle';
import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

const stylesActive = [];

const CoverBaseComponentLib = (props) => {
    const { onRef, image, ratio, mode, style, children, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    const isRatioCustom = ratio === Number(ratio);
    const ratioClassName = `ratio-${isRatioCustom === false ? ratio : String(ratio).replace('.', '')}`;

    const coverStyle = useMemo(
        () => (image === null ? {} : isColor(image) ? { backgroundColor: image } : { backgroundImage: `url(${image})` }),
        [image],
    );

    useEffect(() => {
        let styles = null;

        if (stylesActive.indexOf(ratioClassName) === -1) {
            styles = isRatioCustom === true ? addStyle(`.${ratioClassName}::before { padding-top: ${ratio * 100}%; }`) : null;
            stylesActive.push(ratioClassName);
        }

        return () => {
            stylesActive.splice(stylesActive.indexOf(ratioClassName), 1);
            removeStyle(styles);
        };
    }, [ratio]);

    return (
        <div
            {...rest}
            className={toClassName([
                'cover',
                isRatioCustom === true && 'ratio-parent',
                `mode-${mode}`,
                ratioClassName,
                rest.className,
            ])}
            style={merge({}, style, coverStyle)}
            ref={ref}
        >
            <div className="cover--content ratio-child">{children}</div>
        </div>
    );
};

CoverBaseComponentLib.propTypes = {
    image: PropTypes.any,
    ratio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mode: PropTypes.string,
    style: PropTypes.object,
};

CoverBaseComponentLib.defaultProps = {
    image: null,
    ratio: '16-9',
    mode: 'cover',
    style: {},
};

export default React.memo(CoverBaseComponentLib);
