'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import map from 'lodash/map';

import makeUrl from 'lib/js/utils/makeUrl';

import AppConfig from '../../config/app';

const HelmetLayoutComponent = (props) => {
    const { title, description, canonical, children, ...rest } = props;

    const appUrl = AppConfig.get('url');
    const appName = AppConfig.get('name');

    return (
        <Helmet defaultTitle={appName} titleTemplate={`%s | ${appName}`}>
            <title>{title}</title>
            <meta name="description" content={description} />

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

export default React.memo(HelmetLayoutComponent);
