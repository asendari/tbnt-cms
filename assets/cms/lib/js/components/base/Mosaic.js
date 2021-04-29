'use strict';

/**
 * @name MosaicBaseComponentLib
 * @description Mosaic base component for ReactJS personal library
 * @file ReactJS Mosaic Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import getChildren from 'lib/js/utils/getChildren';
import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

const MosaicBaseComponentLib = (props) => {
    const { onRef, cols, gutter, children, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    const items = getChildren(children);

    const marginH = isNaN(gutter) === false ? gutter : (gutter && gutter.x) ?? 0;
    const marginV = isNaN(gutter) === false ? gutter : (gutter && gutter.y) ?? 0;

    const _renderTile = (child, index) => (
        <li className="mosaic--item">
            <div className="width-1-1" style={{ marginBottom: marginV }}>
                {child}
            </div>
        </li>
    );

    return (
        <div {...rest} className={toClassName(['mosaic', rest.className])} ref={ref}>
            <ul className="mosaic--content" style={{ columnCount: cols, columnGap: marginH, marginBottom: -marginV }}>
                {React.Children.map(items, _renderTile)}
            </ul>
        </div>
    );
};

MosaicBaseComponentLib.propTypes = {
    cols: PropTypes.number,
    gutter: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

MosaicBaseComponentLib.defaultProps = {
    cols: 1,
    gutter: 0,
};

export default React.memo(MosaicBaseComponentLib);
