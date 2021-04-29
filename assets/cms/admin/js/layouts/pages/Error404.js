'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import Page from '../../components/layout/Page';

import Lang from '../../helpers/lang';
import Styles from '../../helpers/styles';

class Error404Page extends React.Component {
    render() {
        return (
            <Page id="error404" menu={{ title: Lang.get('error404.title') }}>
                {this.renderContent()}
            </Page>
        );
    }

    renderContent() {
        return (
            <div className="container padding-24">
                <div className="content --small center">
                    <h1 className="margin-16-bottom">
                        {Styles.get('idk')}

                        <small className="subtitle">{Lang.get('error404.title')}</small>
                    </h1>
                    <p>{Lang.get('error404.message')}</p>
                </div>
            </div>
        );
    }
}

export default Error404Page;
