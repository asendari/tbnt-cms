'use strict';

import React from 'react';
import URI from 'urijs';
import { orderBy } from 'natural-orderby';

import keyBy from 'lodash/keyBy';
import trim from 'lodash/trim';

import makeUrl from 'lib/js/utils/makeUrl';

import withAuth from '../../components/hoc/Auth';
import withServer from '../../components/hoc/Server';

import Page from '../../components/layout/Page';

import Card from '../../components/custom/Card';

import Button from '../../components/base/Button';
import Input from '../../components/base/Input';

import Cache from '../../helpers/cache';
import Form from '../../helpers/form';
import { historyRefresh } from '../../helpers/history';
import Lang from '../../helpers/lang';

import AppConfig from '../../config/app';

class LoginPage extends React.Component {
    state = {
        data: {},
        loggedIn: null,
        loader: false,
    };

    form = new Form(this, 'data');

    redirect = URI().query(true).redirect ?? null;

    componentDidMount() {
        this.props.auth.onAuth((loggedIn) => loggedIn === true && this.doRedirect());
    }

    getRedirectUrl() {
        return this.redirect ? makeUrl(this.redirect.replace(AppConfig.get('url'), ''), true) : Lang.router('home');
    }

    doRedirect() {
        historyRefresh.replace(this.getRedirectUrl());
    }

    login() {
        if (this.state.loader === true) return;

        this.setState({ loader: true, loggedIn: null });

        this.props.auth.login(
            {
                data: this.form.getValues(),
                formHelper: this.form,
            },
            (loggedIn) => {
                this.setState({ loader: loggedIn, loggedIn });

                if (loggedIn === true) this.doRedirect();
            },
        );
    }

    handleLogin() {
        if (trim(this.form.getValue('email')) !== '' && trim(this.form.getValue('password')) !== '') this.login();
    }

    render() {
        return (
            <Page id="login" helmet={Lang.get('login.seo')} menu={false} sidebar={false} footer={false}>
                {this.renderContent()}
            </Page>
        );
    }

    renderContent() {
        return (
            <div className="container padding-24">
                <div className="content --tiny">
                    <Card className="center">
                        <Card.Body className="padding-32-top padding-32-bottom padding-48-left padding-48-right">
                            <h1 className="h3 margin-32-bottom">
                                {Lang.get('login.header.title')}

                                <small className="subtitle">{Lang.get('login.header.subtitle')}</small>
                            </h1>

                            {this.state.loggedIn === false && (
                                <p className="text-danger margin-48-bottom">{Lang.get('login.messages.failed')}</p>
                            )}

                            <div className="margin-24-bottom">
                                <Input
                                    type="text"
                                    name="email"
                                    input={{
                                        placeholder: Lang.get('login.fields.email'),
                                    }}
                                    formHelper={this.form}
                                    onSubmit={::this.handleLogin}
                                />
                            </div>
                            <div className="margin-32-bottom">
                                <Input
                                    type="password"
                                    name="password"
                                    input={{
                                        placeholder: Lang.get('login.fields.password'),
                                    }}
                                    formHelper={this.form}
                                    onSubmit={::this.handleLogin}
                                />
                            </div>
                            <div>
                                <Button className="--primary --full" loader={this.state.loader} onClick={::this.handleLogin}>
                                    {Lang.get('login.buttons.login')}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }
}

LoginPage = withAuth(LoginPage, false);
LoginPage = withServer(LoginPage);

export default LoginPage;
