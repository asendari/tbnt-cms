'use strict';

/**
 * @name OrganizerBaseComponentLib
 * @description Organizer base component for ReactJS personal library
 * @file ReactJS Organizer Component
 *
 * @version 1.2.1 - 2019-12-04
 * @author Alexandre Pilloud
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

import Organizer from 'lib/js/plugins/organizer';

const OrganizerBaseComponentLib = (props) => {
    const { onRef, options, children, ...rest } = props;

    const ref = useRef(null);

    const or = useRef(null);

    useOnRef(onRef, { ref });

    useEffect(() => {
        if (or.current === null) or.current = new Organizer({ ...options, target: ref.current });

        or.current.organize(options.filter);

        return () => {
            or.current.destroy();
        };
    }, [options.filter]);

    return (
        <div {...rest} className={toClassName(['organizer', rest.className])} ref={ref}>
            {children}
        </div>
    );
};

OrganizerBaseComponentLib.propTypes = {
    options: PropTypes.object,
};

OrganizerBaseComponentLib.defaultProps = {
    options: {},
};

export default React.memo(OrganizerBaseComponentLib);
