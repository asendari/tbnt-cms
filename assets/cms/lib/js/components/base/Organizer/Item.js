'use strict';

/**
 * @name OrganizerItemBaseComponentLib
 * @description OrganizerItem base component for ReactJS personal library
 * @file ReactJS OrganizerItem Component
 *
 * @version 1.2.1 - 2019-12-04
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

const OrganizerItemBaseComponentLib = (props) => {
    const { onRef, itemId, filters, children, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    return (
        <div
            {...rest}
            className={toClassName(['organizer--item', rest.className])}
            data-organize-id={itemId}
            data-organize-filters={(filters || []).join(' ')}
            ref={ref}
        >
            {children}
        </div>
    );
};

OrganizerItemBaseComponentLib.propTypes = {
    itemId: PropTypes.any,
    filters: PropTypes.array,
};

OrganizerItemBaseComponentLib.defaultProps = {
    itemId: '',
    filters: [],
};

export default React.memo(OrganizerItemBaseComponentLib);
