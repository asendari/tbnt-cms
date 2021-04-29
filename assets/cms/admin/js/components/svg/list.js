'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import SVG from './svg';

import Styles from '../../helpers/styles';

const ListSVG = (props) => {
    const { color, ...rest } = props;

    return (
        <SVG {...rest} className={toClassName(['svg--list', rest.className])}>
            <path className="svg--anim" fill={color} d="M80 280h256v48H80zM80 184h320v48H80zM80 88h352v48H80z" />
            <g>
                <path className="svg--anim" fill={color} d="M80 376h288v48H80z" />
            </g>
        </SVG>
    );
};

ListSVG.propTypes = {
    color: PropTypes.string,
};

ListSVG.defaultProps = {
    color: Styles.get('text'),
};

export default React.memo(ListSVG);
