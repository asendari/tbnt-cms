'use strict';

/**
 * @name PropTypeRefCbLib
 * @description RefCb PropTypes for ReactJS personal library
 * @file ReactJS RefCb PropTypes
 *
 * @version 1.1.1 - 2019-11-22
 * @author Alexandre Pilloud
 */

import PropTypes from 'prop-types';

import PropTypeRef from './Ref';

export default PropTypes.oneOfType([PropTypeRef, PropTypes.func]);
