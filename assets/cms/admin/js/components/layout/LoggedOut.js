'use strict';

import React from 'react';

import makeUrl from 'lib/js/utils/makeUrl';

import Page from '../layout/Page';

import Card from '../custom/Card';

import Button from '../base/Button';

import Lang from '../../helpers/lang';

class LoggedOutPage extends React.Component {
    handleClick() {
        window.location.href = `${makeUrl(Lang.router('login'))}?redirect=${window.location.href}`;
    }

    render() {
        return (
            <Page id="logged-out" helmet={Lang.get('logged_out.seo')} menu={false} sidebar={false} footer={false}>
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
                            <h1 className="h3 margin-32-bottom">
                                {Lang.get('logged_out.header.title')}

                                <small className="subtitle">{Lang.get('logged_out.header.subtitle')}</small>
                            </h1>
                            <Button onClick={::this.handleClick}>{Lang.get('logged_out.header.button')}</Button>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }
}

export default LoggedOutPage;
