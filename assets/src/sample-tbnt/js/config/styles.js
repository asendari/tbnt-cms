'use strict';

import ObjectHelper from 'lib/js/helpers/object';

import variables from '../../css/variables.scss';

const StylesDay = new ObjectHelper({
    current: variables.white,
    invert: variables.black,
    primary: variables.primary,
    primaryInvert: variables.primary,
});

const StylesDark = new ObjectHelper({
    current: variables.black,
    invert: variables.white,
    primary: variables.primary,
    primaryInvert: variables.white,
});

const StylesConfig = new ObjectHelper({
    ...variables,

    idk: '¯\\_(ツ)_/¯',
});

StylesConfig.getTheme = (path, defaultValue) => {
    return (window.isDarkTheme() === true ? StylesDark : StylesDay).get(path, StylesConfig.get(path, defaultValue));
};

export default StylesConfig;
