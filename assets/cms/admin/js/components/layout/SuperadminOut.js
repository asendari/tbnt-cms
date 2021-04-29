'use strict';

import React from 'react';

import makeUrl from 'lib/js/utils/makeUrl';

import Page from '../layout/Page';

import Card from '../custom/Card';

import Lang from '../../helpers/lang';

class SuperadminOutPage extends React.Component {
    handleClick() {
        this.props.history.goBack();
    }

    render() {
        return (
            <Page id="superadmin-out" helmet={Lang.get('superadmin_out.seo')} menu={false} sidebar={false} footer={false}>
                {this.renderContent()}
            </Page>
        );
    }

    renderContent() {
        return (
            <div className="container padding-24 height-min flex flex-middle">
                <div className="content --tiny">
                    <Card className="center">
                        <Card.Body className="padding-32-top padding-32-bottom padding-48-left padding-48-right">
                            <h1 className="h3">
                                {Lang.get('superadmin_out.header.title')}

                                <small className="subtitle">{Lang.get('superadmin_out.header.subtitle')}</small>
                            </h1>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }
}

export default SuperadminOutPage;
