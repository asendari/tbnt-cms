'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import map from 'lodash/map';

import makeUrl from 'lib/js/utils/makeUrl';

import withTheme from '../hoc/Theme';

import Styles from '../../helpers/styles';

import AppConfig from '../../config/app';

const HelmetLayoutComponent = (props) => {
    const { theme, title, description, canonical, children, ...rest } = props;

    const appUrl = AppConfig.get('url');
    const appName = AppConfig.get('name');

    return (
        <Helmet defaultTitle={appName} titleTemplate={`%s | ${appName}`}>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="theme-color" content={Styles.getTheme('current')} />

            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />

            {map(canonical, (link, langCode) => (
                <link key={langCode} rel="alternate" href={makeUrl([appUrl, link])} hrefLang={langCode} />
            ))}

            {children}
        </Helmet>
    );
};

HelmetLayoutComponent.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    canonical: PropTypes.object,
};

HelmetLayoutComponent.defaultProps = {
    title: '',
    description: '',
    canonical: {},
};

export default React.memo(withTheme(HelmetLayoutComponent));
