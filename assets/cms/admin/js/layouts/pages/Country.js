'use strict';

import React from 'react';

import withAuth from '../../components/hoc/Auth';
import withKeyUpEvent from 'lib/js/components/hoc/KeyUpEvent';
import withServer from '../../components/hoc/Server';

import Page from '../../components/layout/Page';

import Actions from '../../components/custom/Actions';
import Card from '../../components/custom/Card';
import ColumnsDouble from '../../components/custom/ColumnsDouble';
import ColumnsSingleSmall from '../../components/custom/ColumnsSingleSmall';
import Header from '../../components/custom/Header';

import Button from '../../components/base/Button';
import Input from '../../components/base/Input';

import Form from '../../helpers/form';
import Lang from '../../helpers/lang';
import Notification from '../../helpers/notification';

class CountryPage extends React.Component {
    countryId = this.props.match.params?.id;

    state = {
        country: {},
        loader: true,
        error: false,
    };

    form = new Form(this, 'country');

    componentDidMount() {
        this.fetchCountry();

        this.props.keyUpEvent.add(::this.handleKeyUp);
    }

    fetchCountry() {
        this.setState({ loader: true });

        this.props.server.fetch(`countries/${this.countryId}`, {
            method: 'post',
            success: (response, { data: country }) => {
                this.setState({ loader: false, country });
            },
            error: (error, data) => {
                this.setState({ loader: false, error: true });
            },
        });
    }

    updateCountry() {
        if (this.state.loader !== false) return;

        this.notificationLoading = Notification.success(Lang.get('inputs.message_update_loading'));

        this.setState({ loader: 'update' });

        this.props.server.fetch(`countries/${this.countryId}/update`, {
            method: 'post',
            type: 'data',
            data: this.form.getValues(),
            formHelper: this.form,
            success: (response, { data: country }) => {
                this.setState({ loader: false, country }, () => {
                    this.form.resetValues();
                    this.notificationLoading?.hide();

                    Notification.success(Lang.get('country.messages.update_success'));
                });
            },
            error: (error, data) => {
                this.setState({ loader: false }, () => {
                    this.notificationLoading?.hide();
                });
            },
        });
    }

    activeCountry() {
        if (this.state.loader !== false) return;

        this.setState({ loader: 'active' });

        this.props.server.fetch(`countries/${this.countryId}/active`, {
            method: 'post',
            success: (response, { data: country }) => {
                this.setState({ loader: false, country }, () => {
                    Notification.success(Lang.get('country.messages.update_success'));
                });
            },
            error: (error, data) => {
                this.setState({ loader: false });
            },
        });
    }

    inactiveCountry() {
        if (this.state.loader !== false) return;

        this.setState({ loader: 'active' });

        this.props.server.fetch(`countries/${this.countryId}/inactive`, {
            method: 'post',
            success: (response, { data: country }) => {
                this.setState({ loader: false, country }, () => {
                    Notification.success(Lang.get('country.messages.update_success'));
                });
            },
            error: (error, data) => {
                this.setState({ loader: false });
            },
        });
    }

    handleKeyUp(keyCode, keyChar, specialKeys) {
        if (keyChar === 's' && specialKeys.ctrl === true) this.updateCountry();
    }

    render() {
        return (
            <Page id="country" helmet={Lang.get('country.seo')} menu={{ title: Lang.get('country.seo.title') }}>
                {this.renderContent()}
            </Page>
        );
    }

    renderContent() {
        return (
            <>
                <Header>
                    <Header.Title>{Lang.get('country.header.title')}</Header.Title>
                </Header>
                <div className="container padding-24-left padding-24-right padding-40-top padding-40-bottom">
                    <ColumnsDouble>
                        <Card className="margin-32-bottom">
                            <Card.Header>{Lang.get('country.cards.details')}</Card.Header>
                            <Card.Body>
                                <ColumnsSingleSmall>
                                    <Input
                                        type="text"
                                        name="code"
                                        label={Lang.get('country.fields.code')}
                                        mandatory={true}
                                        initialValue={this.form.getState('code')}
                                        formHelper={this.form}
                                    />
                                    <Input
                                        type="text"
                                        name="name"
                                        label={Lang.get('country.fields.name')}
                                        mandatory={true}
                                        initialValue={this.form.getState('name')}
                                        formHelper={this.form}
                                    />
                                    <Input
                                        type="number"
                                        name="tva"
                                        label={Lang.get('country.fields.tva')}
                                        input={{
                                            step: 0.01,
                                        }}
                                        initialValue={this.form.getState('tva')}
                                        formHelper={this.form}
                                    />
                                </ColumnsSingleSmall>
                            </Card.Body>
                        </Card>
                    </ColumnsDouble>
                </div>
                <Actions
                    remove={{
                        active: null,
                    }}
                    active={{
                        active: this.state.country?.is_active,
                        loader: this.state.loader === true || this.state.loader === 'active',
                        onClick: this.state.country?.is_active === true ? ::this.inactiveCountry : ::this.activeCountry,
                    }}
                    action={{
                        name: 'update',
                        loader: this.state.loader === true || this.state.loader === 'update',
                        onClick: ::this.updateCountry,
                    }}
                />
            </>
        );
    }
}

CountryPage = withAuth(CountryPage);
CountryPage = withKeyUpEvent(CountryPage);
CountryPage = withServer(CountryPage);

export default CountryPage;
