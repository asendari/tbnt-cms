'use strict';

/**
 * @name RowsBaseComponentLib
 * @description Rows base component for ReactJS personal library
 * @file ReactJS Rows Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import chunk from 'lodash/chunk';
import fill from 'lodash/fill';

import getChildren from 'lib/js/utils/getChildren';
import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

const RowsBaseComponentLib = (props) => {
    const { onRef, cols, gutter, justify, justifyLess, children, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    const items = chunk(getChildren(children), cols);

    return (
        <div {...rest} className={toClassName(['rows', rest.className])} ref={ref}>
            {React.Children.map(fill(Array(items.length), null), (_, index) => {
                const rowChildren = items[index];
                const isLastRow = index + 1 === items.length;

                return (
                    <div
                        className={toClassName(['rows--row', rowChildren.length === cols ? justify : justifyLess])}
                        style={{
                            marginBottom: isLastRow === true ? 0 : gutter,
                        }}
                    >
                        {rowChildren}
                    </div>
                );
            })}
        </div>
    );
};

RowsBaseComponentLib.propTypes = {
    cols: PropTypes.number,
    gutter: PropTypes.number,
    justify: PropTypes.string,
    justifyLess: PropTypes.string,
};

RowsBaseComponentLib.defaultProps = {
    cols: 1,
    gutter: 0,
    justify: 'flex-between',
    justifyLess: 'flex-around',
};

export default React.memo(RowsBaseComponentLib);
