'use strict';

/**
 * @name PropTypePostItemsLib
 * @description PostItems PropTypes for ReactJS personal library
 * @file ReactJS PostItems PropTypes
 *
 * @version 1.0.0 - 2019-11-22
 * @author Alexandre Pilloud
 */

import PropTypes from 'prop-types';

import { PostItemsLib } from '../../helpers/post';

import PropTypePost from './Post';

export default PropTypes.oneOfType([PropTypePost, PropTypes.instanceOf(PostItemsLib)]);
