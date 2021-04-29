'use strict';

/**
 * @name PortalBaseComponentLib
 * @description Portal base component for ReactJS personal library
 * @file ReactJS Portal Component
 *
 * @version 1.2.1 - 2019-12-04
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'lib/js/helpers/types';

import usePortal from 'lib/js/components/hooks/Portal';

const PortalBaseComponentLib = (props) => {
    const { portalRef, id, children } = props;

    const portal = portalRef ?? useRef(null);

    portal.current = usePortal(id);

    return ReactDOM.createPortal(children, portal.current);
};

PortalBaseComponentLib.propTypes = {
    portalRef: PropTypes.Ref,
    id: PropTypes.string.isRequired,
};

PortalBaseComponentLib.defaultProps = {
    portalRef: null,
};

export default React.memo(PortalBaseComponentLib);
