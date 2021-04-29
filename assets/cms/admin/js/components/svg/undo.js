'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import SVG from './svg';

import Styles from '../../helpers/styles';

const UndoSVG = (props) => {
    const { color, ...rest } = props;

    return (
        <SVG {...rest} className={toClassName(['svg--undo', rest.className])}>
            <path
                className="svg--anim"
                fill={color}
                d="M262.3 179.6c-57.9 0-110.3 21.6-150.7 56.8L32 160v192h197.5l-79.1-76.8c30.4-25.3 69-41.1 111.8-41.1 77.3 0 143.1 48.2 166 117.8l51.8-14.8c-30.4-91.4-116.2-157.5-217.7-157.5z"
            />
        </SVG>
    );
};

UndoSVG.propTypes = {
    color: PropTypes.string,
};

UndoSVG.defaultProps = {
    color: Styles.get('text'),
};

export default React.memo(UndoSVG);
