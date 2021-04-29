'use strict';

/**
 * @name PropTypeNumberString
 * @description NumberString PropTypes for ReactJS personal library
 * @file ReactJS NumberString PropTypes
 *
 * @version 1.1.0 - 2019-06-20
 * @author Alexandre Pilloud
 */

import PropTypes from 'prop-types';

export default PropTypes.oneOfType([PropTypes.number, PropTypes.string]);
