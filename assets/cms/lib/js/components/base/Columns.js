'use strict';

/**
 * @name ColumnsBaseComponentLib
 * @description Columns base component for ReactJS personal library
 * @file ReactJS Columns Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';

import getChildren from 'lib/js/utils/getChildren';
import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

const ColumnsBaseComponentLib = (props) => {
    const { onRef, cols, gutter, offsets, children, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    const items = getChildren(children);

    let leftWidth = 100;
    let leftCols = cols + 0;

    map(offsets, (o, index) => {
        if (index < cols) {
            leftWidth -= o;
            leftCols -= 1;
        }
    });

    const getStyle = (items) =>
        map(items, (child, index) => {
            const width = offsets?.[index % cols] ?? leftWidth / leftCols;
            const marginH = isNaN(gutter) === false ? gutter : (gutter && gutter.x) ?? 0;
            const marginV = isNaN(gutter) === false ? gutter : (gutter && gutter.y) ?? 0;

            const isLastRow = index >= Math.ceil((items.length || 1) / cols) * cols - cols;

            const calcDiff = marginH - marginH / cols;

            return {
                width: calcDiff ? `calc(${width}% - ${calcDiff}px)` : `${width}%`,
                marginRight: (index + 1) % cols === 0 ? 0 : marginH,
                marginBottom: isLastRow === true ? 0 : marginV,
            };
        });

    const style = useMemo(() => getStyle(items), [items.length, cols, gutter, offsets]);

    const _renderColumn = (child, index) => (
        <div className="columns--col" style={style[index]}>
            {child}
        </div>
    );

    return (
        <div {...rest} className={toClassName(['columns', `--cols-${cols}`, rest.className])} ref={ref}>
            {React.Children.map(items, _renderColumn)}
        </div>
    );
};

ColumnsBaseComponentLib.propTypes = {
    cols: PropTypes.number,
    gutter: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    offsets: PropTypes.object,
};

ColumnsBaseComponentLib.defaultProps = {
    cols: 1,
    gutter: 0,
    offsets: {},
};

export default React.memo(ColumnsBaseComponentLib);
