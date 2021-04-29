'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import withTheme from '../../hoc/Theme';

import SVGClose from '../../svg/close';

import Styles from '../../../helpers/styles';

const SVGCloseThemeComponent = (props) => {
    const { theme, color, ...rest } = props;

    return <SVGClose {...rest} color={color ? color : Styles.getTheme('primary')} />;
};

SVGCloseThemeComponent.propTypes = {
    theme: PropTypes.string,
};

SVGCloseThemeComponent.defaultProps = {
    theme: '',
};

export default React.memo(withTheme(SVGCloseThemeComponent));
