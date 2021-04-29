'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import SVG from './svg';

import Styles from '../../helpers/styles';

const ContactSVG = (props) => {
    const { color, ...rest } = props;

    return (
        <SVG {...rest} className={toClassName(['svg--contact', rest.className])}>
            <path
                className="svg--anim"
                fill={color}
                d="M256 48C141.6 48 48 141.6 48 256s93.6 208 208 208 208-93.6 208-208S370.4 48 256 48zm0 62.4c34.3 0 62.4 28.1 62.4 62.4s-28.1 62.4-62.4 62.4-62.4-28.1-62.4-62.4 28.1-62.4 62.4-62.4zm0 300.4c-52 0-97.8-27-124.8-66.6 1-41.6 83.2-64.5 124.8-64.5s123.8 22.9 124.8 64.5c-27 39.5-72.8 66.6-124.8 66.6z"
            />
        </SVG>
    );
};

ContactSVG.propTypes = {
    color: PropTypes.string,
};

ContactSVG.defaultProps = {
    color: Styles.get('text'),
};

export default React.memo(ContactSVG);
