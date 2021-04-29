'use strict';

import React from 'react';
import reduce from 'lodash/reduce';

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

import Cache from '../../helpers/cache';
import Dialog from '../../helpers/dialog';
import Form from '../../helpers/form';
import Lang from '../../helpers/lang';
import Notification from '../../helpers/notification';

import LangConfig from '../../config/lang';

const defaultLangId = LangConfig.get('all')[LangConfig.get('default_code')]?.id;
const langOptions = reduce(
    LangConfig.get('all'),
    (res, lang) => res.concat(lang.is_hidden === true ? [] : [{ value: lang.id, label: lang.name }]),
    [],
);

const cacheItemsCreated = 'users:itemCreated';
const cacheItemsUpdated = 'users:itemUpdated';
const cacheItemsDeleted = 'users:itemDeleted';

class UserPage extends React.Component {
    userId = this.props.match.params?.id;

    edit = this.userId !== 'new';

    state = {
        user: null,
        loader: true,
        error: false,
    };

    form = new Form(this, 'user');

    notificationLoading = null;

    componentDidMount() {
        if (this.edit === true) this.fetchUser();
        else this.setState({ loader: false }, ::this.onUser);
    }

    onUser() {
        this.props.keyUpEvent.add(::this.handleKeyUp);
    }

    fetchUser() {
        this.setState({ loader: true });

        this.props.server.fetch(`users/${this.userId}`, {
            method: 'post',
            success: (response, { data: user }) => {
                this.setState({ loader: false, user }, ::this.onUser);
            },
            error: (error, data) => {
                this.setState({ loader: false, error: true });
            },
        });
    }

    createUser() {
        if (this.state.loader !== false) return;

        this.notificationLoading = Notification.success(Lang.get('inputs.message_create_loading'), {
            hideTimeout: 60 * 1000 * 2,
        });

        this.setState({ loader: 'create' });

        this.props.server.fetch('users/create', {
            method: 'post',
            data: this.form.getValues(),
            formHelper: this.form,
            alert: true,
            success: (response, { data: user }) => {
                this.setChangedCache(cacheItemsCreated, user);

                this.props.history.replace(Lang.router('user').replace(':id', user.id));

                this.notificationLoading?.hide();

                Notification.success(Lang.get('user.messages.create_success'));
            },
            error: (error, data) => {
                this.setState({ loader: false }, () => {
                    this.notificationLoading?.hide();
                });
            },
        });
    }

    updateUser() {
        if (this.state.loader !== false) return;

        this.notificationLoading = Notification.success(Lang.get('inputs.message_update_loading'), {
            hideTimeout: 60 * 1000 * 2,
        });

        this.setState({ loader: 'update' });

        this.props.server.fetch(`users/${this.userId}/update`, {
            method: 'post',
            data: this.form.getValues(),
            formHelper: this.form,
            alert: true,
            success: (response, { data: user }) => {
                this.setChangedCache(cacheItemsUpdated, user);

                this.setState({ loader: false, user }, () => {
                    this.form.resetValues();
                    this.notificationLoading?.hide();

                    Notification.success(Lang.get('user.messages.update_success'));
                });
            },
            error: (error, data) => {
                this.setState({ loader: false }, () => {
                    this.notificationLoading?.hide();
                });
            },
        });
    }

    newPasswordUser() {
        if (this.state.loader !== false) return;

        this.setState({ loader: 'new-password' });

        this.props.server.fetch(`users/${this.userId}/password/update`, {
            method: 'post',
            alert: true,
            success: (response, data) => {
                this.setState({ loader: false }, () => {
                    Notification.success(Lang.get('user.messages.new_password_success'));
                });
            },
            error: (error, data) => {
                this.setState({ loader: false });
            },
        });
    }

    forgottenPasswordUser() {
        if (this.state.loader !== false) return;

        this.setState({ loader: 'forgotten-password' });

        this.props.server.fetch(`users/${this.userId}/forgotten-password`, {
            method: 'post',
            alert: true,
            success: (response, data) => {
                this.setState({ loader: false }, () => {
                    Notification.success(Lang.get('user.messages.forgotten_password_success'));
                });
            },
            error: (error, data) => {
                this.setState({ loader: false });
            },
        });
    }

    activeUser() {
        if (this.state.loader !== false) return;

        this.setState({ loader: 'active' });

        this.props.server.fetch(`users/${this.userId}/active`, {
            method: 'post',
            alert: true,
            success: (response, { data: user }) => {
                this.setChangedCache(cacheItemsUpdated, user);

                this.setState({ loader: false, user }, () => {
                    Notification.success(Lang.get('user.messages.update_success'));
                });
            },
            error: (error, data) => {
                this.setState({ loader: false });
            },
        });
    }

    inactiveUser() {
        if (this.state.loader !== false) return;

        this.setState({ loader: 'active' });

        this.props.server.fetch(`users/${this.userId}/inactive`, {
            method: 'post',
            alert: true,
            success: (response, { data: user }) => {
                this.setChangedCache(cacheItemsUpdated, user);

                this.setState({ loader: false, user }, () => {
                    Notification.success(Lang.get('user.messages.update_success'));
                });
            },
            error: (error, data) => {
                this.setState({ loader: false });
            },
        });
    }

    deleteUser() {
        if (this.state.loader !== false) return;

        this.setState({ loader: 'delete' });

        this.props.server.fetch(`users/${this.userId}/delete`, {
            method: 'post',
            alert: true,
            success: (response, { data: user }) => {
                this.setChangedCache(cacheItemsDeleted, user);

                this.props.history.replace(Lang.router('users'));

                Notification.success(Lang.get('user.messages.delete_success'));
            },
            error: (error, data) => {
                this.setState({ loader: false });
            },
        });
    }

    setChangedCache(cacheItems, item) {
        Cache.set(cacheItems, Cache.get(cacheItems, []).concat([item]));
    }

    handleNewPasswordUser() {
        Dialog.confirm(Lang.get('user.messages.new_password_confirmation'), {
            onAccept: ::this.newPasswordUser,
        });
    }

    handleForgottenPasswordUser() {
        Dialog.confirm(Lang.get('user.messages.forgotten_password_confirmation'), {
            onAccept: ::this.forgottenPasswordUser,
        });
    }

    handleDelete() {
        Dialog.confirm(Lang.get('user.messages.delete_confirmation'), { onAccept: ::this.deleteUser });
    }

    handleCreateUpdate() {
        this.edit === false ? this.createUser() : this.updateUser();
    }

    handleKeyUp(keyCode, keyChar, specialKeys) {
        if (keyChar === 's' && specialKeys.ctrl === true) this.handleCreateUpdate();
    }

    render() {
        const seo = {
            title:
                this.edit === true
                    ? this.state.loader === true
                        ? Lang.get('words.loading_dot')
                        : Lang.get('user.seo.title_update', this.state.user?.profile?.name ?? '')
                    : Lang.get('user.seo.title_create'),
        };

        return (
            <Page id="user" helmet={seo} menu={seo}>
                {this.renderContent()}
            </Page>
        );
    }

    renderContent() {
        const firstLoader = this.edit === true && this.state.loader === true && this.state.user === null;

        const isActive = this.form.getState('is_active', false);

        return (
            <>
                <Header>
                    <Header.Title>
                        {this.edit === true
                            ? this.state.loader === true
                                ? Lang.get('words.loading_dot')
                                : Lang.get('user.header.title_update', this.state.user?.profile?.name ?? '', isActive)
                            : Lang.get('user.header.title_create')}
                    </Header.Title>
                </Header>
                <div className="container padding-24-left padding-24-right padding-40-top padding-40-bottom">
                    <ColumnsDouble>
                        <Card>
                            <Card.Header>{Lang.get('user.cards.infos')}</Card.Header>
                            <Card.Body loader={firstLoader === true}>
                                <ColumnsSingleSmall>
                                    <Input
                                        type="text"
                                        name="firstname"
                                        label={Lang.get('user.fields.firstname')}
                                        mandatory={true}
                                        initialValue={this.form.getState('profile.firstname')}
                                        formHelper={this.form}
                                    />
                                    <Input
                                        type="text"
                                        name="lastname"
                                        label={Lang.get('user.fields.lastname')}
                                        mandatory={true}
                                        initialValue={this.form.getState('profile.lastname')}
                                        formHelper={this.form}
                                    />
                                    <Input
                                        type="email"
                                        name="email"
                                        label={Lang.get('user.fields.email')}
                                        mandatory={true}
                                        initialValue={this.form.getState('profile.email')}
                                        formHelper={this.form}
                                    />
                                    <Input
                                        type="select"
                                        name="lang_id"
                                        label={Lang.get('user.fields.lang_id')}
                                        mandatory={true}
                                        input={{ options: langOptions }}
                                        initialValue={this.form.getState('lang_id', defaultLangId)}
                                        formHelper={this.form}
                                    />
                                    <div>
                                        <p className="margin-8-bottom">{Lang.get('user.fields.password')}</p>

                                        {(this.edit === false && (
                                            <p className="text-info">{Lang.get('user.messages.password_create')}</p>
                                        )) ||
                                            (this.form.getState('has_password', false) === false && isActive === false && (
                                                <p className="text-info">{Lang.get('user.messages.password_active')}</p>
                                            )) || (
                                                <>
                                                    <div>
                                                        <Input
                                                            type="password"
                                                            name="password"
                                                            input={{
                                                                placeholder: Lang.get('user.fields.password_placeholder'),
                                                            }}
                                                            formHelper={this.form}
                                                        />
                                                    </div>
                                                    <div className="flex flex-center padding-8-top padding-8-bottom">
                                                        <span>{Lang.get('words.or').toLowerCase()}</span>
                                                    </div>
                                                    <div className="flex flex-center">
                                                        <Button
                                                            className="--info"
                                                            loader={this.state.loader === 'new-password'}
                                                            disabled={this.state.loader !== false}
                                                            onClick={::this.handleNewPasswordUser}
                                                        >
                                                            {Lang.get('user.buttons.new_password')}
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-center padding-8-top padding-8-bottom">
                                                        <span>{Lang.get('words.or').toLowerCase()}</span>
                                                    </div>
                                                    <div className="flex flex-center">
                                                        <Button
                                                            className="--info"
                                                            loader={this.state.loader === 'forgotten-password'}
                                                            disabled={this.state.loader !== false}
                                                            onClick={::this.handleForgottenPasswordUser}
                                                        >
                                                            {Lang.get('user.buttons.forgotten_password')}
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                    </div>
                                </ColumnsSingleSmall>
                            </Card.Body>
                        </Card>

                        {this.edit === true && (
                            <Card>
                                <Card.Header>{Lang.get('user.cards.details')}</Card.Header>
                                <Card.Body loader={firstLoader === true}>
                                    <ColumnsSingleSmall>
                                        <Input
                                            type="datetime"
                                            name="created_at"
                                            label={Lang.get('user.fields.created_at')}
                                            readOnly={true}
                                            initialValue={this.form.getState('created_at')}
                                        />
                                        <Input
                                            type="datetime"
                                            name="updated_at"
                                            label={Lang.get('user.fields.updated_at')}
                                            readOnly={true}
                                            initialValue={this.form.getState('updated_at')}
                                        />
                                        <Input
                                            type="datetime"
                                            name="last_connected_at"
                                            label={Lang.get('user.fields.last_connected_at')}
                                            readOnly={true}
                                            initialValue={this.form.getState('last_connected_at')}
                                        />
                                    </ColumnsSingleSmall>
                                </Card.Body>
                            </Card>
                        )}
                    </ColumnsDouble>
                </div>
                <Actions
                    remove={{
                        active: this.edit === true,
                        loader: this.state.loader === 'delete',
                        disabled: this.state.loader !== false,
                        onClick: ::this.handleDelete,
                    }}
                    active={{
                        active: this.edit === true ? isActive : null,
                        loader: this.state.loader === 'active',
                        disabled: this.state.loader !== false,
                        onClick: isActive === true ? ::this.inactiveUser : ::this.activeUser,
                    }}
                    action={{
                        name: this.edit === true ? 'update' : 'create',
                        loader: ['create', 'update'].indexOf(this.state.loader) !== -1,
                        disabled: this.state.loader !== false,
                        onClick: ::this.handleCreateUpdate,
                    }}
                />
            </>
        );
    }
}

UserPage = withAuth(UserPage);
UserPage = withKeyUpEvent(UserPage);
UserPage = withServer(UserPage);

export default UserPage;
