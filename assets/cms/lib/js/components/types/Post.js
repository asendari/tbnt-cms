'use strict';

/**
 * @name PropTypePostLib
 * @description Post PropTypes for ReactJS personal library
 * @file ReactJS Post PropTypes
 *
 * @version 1.0.0 - 2019-11-22
 * @author Alexandre Pilloud
 */

import PropTypes from 'prop-types';

import Post from '../../helpers/post';

export default PropTypes.instanceOf(Post);
