'use strict';

import React from 'react';

import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import map from 'lodash/map';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';

import call from 'lib/js/utils/call';
import isObjectType from 'lib/js/utils/isObjectType';
import toClassName from 'lib/js/utils/toClassName';

import withAuth from '../../../components/hoc/Auth';
import withKeyUpEvent from 'lib/js/components/hoc/KeyUpEvent';
import withServer from '../../../components/hoc/Server';

import Page from '../../../components/layout/Page';
import RouteLeavingGuard from '../../../components/layout/RouteLeavingGuard';

import Actions from '../../../components/custom/Actions';
import Card from '../../../components/custom/Card';
import ColumnsDouble from '../../../components/custom/ColumnsDouble';
import ColumnsSingle from '../../../components/custom/ColumnsSingle';
import ColumnsSingleSmall from '../../../components/custom/ColumnsSingleSmall';
import Header from '../../../components/custom/Header';

import Input from '../../../components/base/Input';

import Fields from './Fields';

import Cache from '../../../helpers/cache';
import Form from '../../../helpers/form';
import Dialog from '../../../helpers/dialog';
import Lang from '../../../helpers/lang';
import Notification from '../../../helpers/notification';
import User from '../../../helpers/user';

import LangConfig from '../../../config/lang';
import AppConfig from '../../../config/app';

const defaultLangCode = LangConfig.get('default_code');

const cacheItemsCreated = 'posts:itemCreated';
const cacheItemsUpdated = 'posts:itemUpdated';
const cacheItemsDeleted = 'posts:itemDeleted';

class PostPage extends React.Component {
    postId = this.props.match.params?.id;
    type = this.props.match.params?.type;
    postType = Cache.get(`posts_types.${this.type}`, null) ?? null;

    cacheItemsCreated = `${cacheItemsCreated}:${this.type}`;
    cacheItemsUpdated = `${cacheItemsUpdated}:${this.type}`;
    cacheItemsDeleted = `${cacheItemsDeleted}:${this.type}`;

    edit = this.postId !== 'new';

    state = {
        post: null,
        postConfig: null,
        postType: null,
        postTypeRef: this.postType,
        postsParents: [],
        errors: {},
        langCode: defaultLangCode,
        loader: this.edit === true,
        error: false,
        willRedirect: false,
    };

    form = new Form(this, 'post', {
        onChange: ::this.onFormState,
    });

    notificationLoading = null;

    isSuperadmin = User.isSuperadmin();

    static getDerivedStateFromProps(props, state) {
        const findBy = (item) => item.post_id == state.post?.id;

        const reduceCb = (result, item) => {
            if ((item.restrictions ?? []).length !== 0 && !find(item.restrictions, findBy)) return result;
            if (item.items !== undefined) item.items = reduce(item.items, reduceCb, []);

            return result.concat([item]);
        };

        const postConfig = merge({}, state.postTypeRef?.config ?? {}, state.post?.config ?? {});
        const postType = {
            ...omit(state.postTypeRef, 'items'),
            items: reduce(state.postTypeRef.items, reduceCb, []),
        };

        return { postConfig, postType, postTypeRef: state.postTypeRef };
    }

    componentDidMount() {
        if (this.state.postTypeRef === null) this.fetchPostType(this.edit);
        else this.onPostType();
    }

    onPostType() {
        if (this.edit === true) this.fetchPost();
        else this.onPost();
    }

    onPost() {
        if (this.isAuthorized('post_id') === true) this.fetchPostParents();

        this.props.keyUpEvent.add(::this.handleKeyUp);
    }

    onFormState(state, errors) {
        this.setState({ errors: state === 'errors' ? errors : {} });
    }

    fetchPostParents() {
        this.props.server.fetch(`posts`, {
            method: 'post',
            params: { page_count: -1 },
            data: { order: 'reference-0' },
            success: (response, { data }) => {
                this.setState((oldState) => ({
                    postsParents: reduce(
                        data,
                        (acc, item) => {
                            if (
                                item.id !== this.postId &&
                                find(Cache.get('posts_types'), (postType) => postType.id === item.post_type_id)?.is_page
                            ) {
                                acc.push({
                                    label: item.reference,
                                    value: String(item.id),
                                });
                            }

                            return acc;
                        },
                        [],
                    ),
                }));
            },
        });
    }

    fetchPostType(loader = false) {
        this.setState({ loader: true });

        this.props.server.fetch(`posts-types/${this.type}`, {
            method: 'post',
            success: (response, { data: postTypeRef }) => {
                Cache.set(`posts_types.${this.type}`, postTypeRef);

                this.setState({ loader, postTypeRef }, ::this.onPostType);
            },
            error: (error, data) => {
                this.setState({ loader: false, error: true });
            },
        });
    }

    fetchPost() {
        this.setState({ loader: true });

        this.props.server.fetch(`posts/${this.postId}`, {
            method: 'post',
            success: (response, { data: post }) => {
                this.setState({ loader: false, post }, ::this.onPost);
            },
            error: (error, data) => {
                this.setState({ loader: false, error: true });
            },
        });
    }

    createPost() {
        if (this.state.loader !== false) return;

        const values = this.getValues();

        this.notificationLoading = Notification.success(Lang.get('inputs.message_create_loading'), {
            hideTimeout: 60 * 1000 * 2,
        });

        this.setState({ loader: 'create' });

        this.props.server.fetch(`posts/${this.type}/create`, {
            method: 'post',
            data: omit(values, 'media'),
            formHelper: this.form,
            alert: true,
            success: (response, { data: post }) => {
                this.postId = post.id;

                this.updateMedia(values, post, (responseData) =>
                    this.setState({ willRedirect: true }, () => {
                        this.setChangedCache(this.cacheItemsCreated, responseData);

                        this.props.history.replace(
                            Lang.router('post').replace(':type', this.type).replace(':id', responseData.id),
                        );

                        this.notificationLoading?.hide();

                        Notification.success(Lang.get('post.messages.create_success'));
                    }),
                );
            },
            error: (error, data) => {
                this.setState({ loader: false }, () => {
                    this.notificationLoading?.hide();
                });
            },
        });
    }

    updatePost() {
        if (this.state.loader !== false) return;

        const values = this.getValues();

        this.notificationLoading = Notification.success(Lang.get('inputs.message_update_loading'), {
            hideTimeout: 60 * 1000 * 2,
        });

        this.setState({ loader: 'update' });

        this.props.server.fetch(`posts/${this.postId}/update`, {
            method: 'post',
            data: omit(values, 'media'),
            formHelper: this.form,
            alert: true,
            success: (response, { data: post }) => {
                this.updateMedia(values, post, (responseData) => {
                    this.setChangedCache(this.cacheItemsUpdated, responseData);

                    this.setState(
                        (oldState) => ({
                            loader: false,
                            post: responseData === null ? oldState.post : responseData,
                        }),
                        () => {
                            this.form.resetValues();
                            this.notificationLoading?.hide();

                            Notification.success(Lang.get('post.messages.update_success'));
                        },
                    );
                });
            },
            error: (error, data) => {
                this.setState({ loader: false }, () => {
                    this.notificationLoading?.hide();
                });
            },
        });
    }

    updateMedia(values, post, cb) {
        if (this.state.loader === false) return;

        const media = {};

        const reduceMedia = (items, postItems) =>
            map(items, (item) => {
                if (!postItems) return null;
                else if (item.type === 'group') reduceMedia(item.items, postItems?.[item.key]?.items);
                else if (item.type === 'rows')
                    map(item.value, (value, index) => reduceMedia(value.items, postItems?.[item.key]?.[index]?.items));
                else media[postItems?.[item.key]?.id] = item.value;
            });

        reduceMedia(values.media, post.items);

        const done = (responseData) => call(cb, responseData);

        if (isEmpty(media) === true) {
            done(post);
        } else {
            this.props.server.fetch(`posts/${this.postId}/media/update`, {
                method: 'post',
                type: 'data',
                data: { media, lang_code: values.lang_code ?? this.state.langCode },
                formHelper: this.form,
                alert: true,
                success: (response, data) => done(data.data),
                error: (error, data) => done(null),
            });
        }
    }

    activePost() {
        if (this.state.loader !== false) return;

        this.setState({ loader: 'active' });

        this.props.server.fetch(`posts/${this.postId}/active`, {
            method: 'post',
            alert: true,
            success: (response, { data: post }) => {
                this.setChangedCache(this.cacheItemsUpdated, post);

                this.setState({ loader: false, post }, () => {
                    Notification.success(Lang.get('post.messages.update_success'));
                });
            },
            error: (error, data) => {
                this.setState({ loader: false });
            },
        });
    }

    inactivePost() {
        if (this.state.loader !== false) return;

        this.setState({ loader: 'active' });

        this.props.server.fetch(`posts/${this.postId}/inactive`, {
            method: 'post',
            alert: true,
            success: (response, { data: post }) => {
                this.setChangedCache(this.cacheItemsUpdated, post);

                this.setState({ loader: false, post }, () => {
                    Notification.success(Lang.get('post.messages.update_success'));
                });
            },
            error: (error, data) => {
                this.setState({ loader: false });
            },
        });
    }

    deletePost() {
        if (this.state.loader !== false) return;

        this.setState({ loader: 'delete' });

        this.props.server.fetch(`posts/${this.postId}/delete`, {
            method: 'post',
            alert: true,
            success: (response, { data: post }) => {
                this.setChangedCache(this.cacheItemsDeleted, post);

                this.props.history.replace(Lang.router('posts').replace(':type', this.type));

                Notification.success(Lang.get('post.messages.delete_success'));
            },
            error: (error, data) => {
                this.setState({ loader: false });
            },
        });
    }

    setChangedCache(cacheItems, item) {
        Cache.set(cacheItems, Cache.get(cacheItems, []).concat([item]));
    }

    getValues() {
        const reduceFields = (items, type) =>
            reduce(
                items,
                (result, item, key) => {
                    const isFile = isObjectType(item.value, 'File');
                    const isMedia = item.type === 'file' && isFile === true;

                    if (item.type === 'group') {
                        item.items = reduceFields(item.items, type);

                        if (isEmpty(item.items) === true) return result;
                    } else if (item.type === 'rows') {
                        item.value = reduce(
                            item.value,
                            (subResult, value) => {
                                value.items = reduceFields(value.items, type);

                                if (type === 'media' || isEmpty(value.items) === false) subResult.push(value);

                                return subResult;
                            },
                            [],
                        );

                        if (isEmpty(item.value) === true) return result;
                    } else {
                        if (type === 'media' && isMedia === false) return result;
                        if (type === 'fields' && isMedia === true) item.value = item.id;
                    }

                    return { ...result, [key]: item };
                },
                {},
            );

        const data = this.form.getValuesObject();

        if (data.config?.modes) data.config.modes = reduce(data.config.modes, (result, key) => ({ ...result, [key]: 0 }), {});

        const fields = this.fields.getValues();

        return {
            ...data,
            fields: reduceFields(cloneDeep(fields), 'fields'),
            media: reduceFields(cloneDeep(fields), 'media'),
            lang_code: this.state.langCode,
        };
    }

    getUpdatablesValues() {
        return this.form.getUpdatablesInputs().concat(this.fields?.form.getUpdatablesInputs() ?? []);
    }

    getUpdatablesValuesTranslatable() {
        return filter(this.getUpdatablesValues(), (field) => field.props['data-translatable'] !== undefined);
    }

    getConfig(key, defaultValue = null) {
        return this.state.postConfig?.[key] ?? defaultValue;
    }

    getConfigMode(key) {
        const mode = this.getConfig('modes', {})[key] ?? null;

        return mode === null ? null : Number(mode) || 0;
    }

    isRequired(key) {
        return Boolean(this.getConfig('required', {})[key] ?? null);
    }

    isAuthorized(key) {
        if (this.edit === true && this.state.post?.id === undefined) return false;

        const mode = this.getConfigMode(key);

        if (mode === null) return true;

        return User.isAuthorized(mode);
    }

    handleDelete() {
        Dialog.confirm(Lang.get('post.messages.delete_confirmation'), { onAccept: ::this.deletePost });
    }

    handleKeyUp(keyCode, keyChar, specialKeys) {
        if (keyChar === 's' && specialKeys.ctrl === true) this.edit === false ? this.createPost() : this.updatePost();
    }

    handleLanguage(language) {
        const changeLanguage = () => this.setState({ langCode: language.code });

        if (this.state.langCode === language.code) return;
        if (this.getUpdatablesValuesTranslatable().length === 0) return changeLanguage();

        Dialog.confirm(Lang.get('inputs.message_unsaved'), { onAccept: changeLanguage });
    }

    handlePromptMessage() {
        return this.getUpdatablesValues().length !== 0 ? Lang.get('inputs.message_unsaved') : true;
    }

    handleFieldsRef(ref) {
        this.fields = ref;
    }

    render() {
        const seo = {
            title:
                this.edit === true
                    ? this.state.loader === true
                        ? Lang.get('words.loading_dot')
                        : Lang.get('post.seo.title_update', this.state.post?.reference ?? '')
                    : Lang.get('post.seo.title_create', this.state.postType?.label),
        };

        return (
            <>
                {this.state.willRedirect === false && <RouteLeavingGuard message={::this.handlePromptMessage} />}

                <Page id="post" helmet={seo} menu={seo} sidebar={{ active: ['posts', { type: this.type }] }}>
                    {this.renderContent()}
                </Page>
            </>
        );
    }

    renderContent() {
        if (this.state.postType === null) return null;

        const firstLoader = this.edit === true && this.state.loader === true && this.state.post === null;

        const isPage = this.state.postType.is_page;
        const isActive = this.state.post?.is_active || false;
        const isUpdatable = this.isSuperadmin === true || this.state.postType.mode >= 2;
        const isWritable = this.isSuperadmin === true || this.state.postType.mode === 3;

        const isTitleAuthorized = isPage === true && this.isAuthorized('title');
        const isDescriptionAuthorized = isPage === true && this.isAuthorized('description');
        const isUrlAuthorized = isPage === true && this.isAuthorized('url');
        const isPostIdAuthorized = isPage === true && this.isAuthorized('post_id');

        const isCreatedAtAuhtorized = this.edit === true;
        const isUpdatedAtAuhtorized = this.edit === true;
        const isVisibleAtAuhtorized = this.isAuthorized('visible_at');
        const isHiddenAtAuhtorized = this.isAuthorized('hidden_at');
        const isPositionAuhtorized = this.isAuthorized('position');

        return (
            <>
                <Header>
                    <Header.Title>
                        {this.edit === true
                            ? firstLoader === true
                                ? Lang.get('words.loading_dot')
                                : Lang.get('post.header.title_update', this.state.post?.reference ?? '', isActive)
                            : Lang.get('post.header.title_create', this.state.postType?.label)}
                    </Header.Title>

                    {this.edit === true && <Header.Languages active={this.state.langCode} onSelected={::this.handleLanguage} />}
                </Header>
                <div className="container padding-24-left padding-24-right padding-40-top padding-40-bottom">
                    <ColumnsSingle>
                        <ColumnsDouble>
                            <Card>
                                <Card.Header>{Lang.get('post.cards.seo')}</Card.Header>
                                <Card.Body loader={isPage === true && firstLoader === true} content={isPage}>
                                    <ColumnsSingleSmall>
                                        {isTitleAuthorized === true && (
                                            <Input
                                                data-translatable
                                                type="text"
                                                name="title"
                                                label={Lang.get('post.fields.title')}
                                                langCode={this.state.langCode}
                                                superadmin={this.getConfigMode('title') === 0}
                                                mandatory={this.state.langCode === defaultLangCode}
                                                initialValue={this.form.getState(`trans.${this.state.langCode}.title`)}
                                                formHelper={this.form}
                                            />
                                        )}

                                        {isDescriptionAuthorized === true && (
                                            <Input
                                                data-translatable
                                                type="textarea"
                                                name="description"
                                                label={Lang.get('post.fields.description')}
                                                langCode={this.state.langCode}
                                                superadmin={this.getConfigMode('description') === 0}
                                                mandatory={this.state.langCode === defaultLangCode}
                                                initialValue={this.form.getState(`trans.${this.state.langCode}.description`)}
                                                formHelper={this.form}
                                            />
                                        )}

                                        {isUrlAuthorized === true && (
                                            <Input
                                                data-translatable
                                                type="text"
                                                name="url"
                                                label={Lang.get('post.fields.url')}
                                                langCode={this.state.langCode}
                                                superadmin={this.getConfigMode('url') === 0}
                                                mandatory={this.state.langCode === defaultLangCode}
                                                initialValue={this.form.getState(`trans.${this.state.langCode}.url`)}
                                                formHelper={this.form}
                                            />
                                        )}

                                        {isPostIdAuthorized === true && (
                                            <Input
                                                type="select"
                                                name="post_id"
                                                label={Lang.get('post.fields.post_id')}
                                                superadmin={this.getConfigMode('post_id') === 0}
                                                mandatory={this.isRequired('post_id')}
                                                input={{ empty: true, options: this.state.postsParents }}
                                                initialValue={this.form.getState('post_id')}
                                                formHelper={this.form}
                                            />
                                        )}

                                        {isPage === true && (
                                            <Input
                                                type="select"
                                                name="is_indexable"
                                                label={Lang.get('post.fields.is_indexable')}
                                                input={{ options: optionsBool }}
                                                initialValue={Number(this.form.getState('is_indexable', 1))}
                                                formHelper={this.form}
                                            />
                                        )}

                                        {false && (
                                            <Input
                                                type="select"
                                                name="is_visible"
                                                label={Lang.get('post.fields.is_visible')}
                                                superadmin={true}
                                                input={{ options: optionsBool }}
                                                initialValue={Number(this.form.getState('is_visible', 0))}
                                                formHelper={this.form}
                                            />
                                        )}
                                    </ColumnsSingleSmall>
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Header>{Lang.get('post.cards.details')}</Card.Header>
                                <Card.Body loader={firstLoader}>
                                    <ColumnsSingleSmall>
                                        <Input
                                            type="text"
                                            name="reference"
                                            label={Lang.get('post.fields.reference')}
                                            mandatory={true}
                                            initialValue={this.form.getState('reference')}
                                            formHelper={this.form}
                                        />

                                        {this.isSuperadmin === true && this.state.postType?.has_key === true && (
                                            <Input
                                                type="text"
                                                name="key"
                                                label={Lang.get('post.fields.key')}
                                                superadmin={true}
                                                mandatory={true}
                                                initialValue={this.form.getState('key')}
                                                formHelper={this.form}
                                            />
                                        )}

                                        {isPositionAuhtorized === true && (
                                            <Input
                                                type="number"
                                                name="position"
                                                label={Lang.get('post.fields.position')}
                                                superadmin={this.getConfigMode('position') === 0}
                                                mandatory={this.isRequired('position')}
                                                input={{ min: 0, step: 1 }}
                                                initialValue={this.form.getState('position')}
                                                formHelper={this.form}
                                            />
                                        )}

                                        {this.isSuperadmin === true && (
                                            <Input
                                                type="selectMultiple"
                                                name="config.modes"
                                                label={Lang.get('post.fields.modes')}
                                                superadmin={true}
                                                input={{ options: optionsModes }}
                                                initialValue={keys(this.form.getState('config.modes', {}))}
                                                formHelper={this.form}
                                            />
                                        )}

                                        {isVisibleAtAuhtorized === true && (
                                            <Input
                                                type="datetime"
                                                name="visible_at"
                                                label={Lang.get('post.fields.visible_at')}
                                                superadmin={this.getConfigMode('visible_at') === 0}
                                                mandatory={this.isRequired('visible_at')}
                                                initialValue={this.form.getState('visible_at')}
                                                formHelper={this.form}
                                            />
                                        )}

                                        {isHiddenAtAuhtorized === true && (
                                            <Input
                                                type="datetime"
                                                name="hidden_at"
                                                label={Lang.get('post.fields.hidden_at')}
                                                superadmin={this.getConfigMode('hidden_at') === 0}
                                                mandatory={this.isRequired('hidden_at')}
                                                initialValue={this.form.getState('hidden_at')}
                                                formHelper={this.form}
                                            />
                                        )}

                                        {isCreatedAtAuhtorized === true && (
                                            <Input
                                                type="datetime"
                                                label={Lang.get('post.fields.created_at')}
                                                readOnly={true}
                                                initialValue={this.form.getState('created_at')}
                                            />
                                        )}

                                        {isUpdatedAtAuhtorized === true && (
                                            <Input
                                                type="datetime"
                                                label={Lang.get('post.fields.updated_at')}
                                                readOnly={true}
                                                initialValue={this.form.getState('updated_at')}
                                            />
                                        )}
                                    </ColumnsSingleSmall>
                                </Card.Body>
                            </Card>
                        </ColumnsDouble>

                        {(firstLoader === true && (
                            <Card>
                                <Card.Body loader={true} />
                            </Card>
                        )) || (
                            <Fields
                                edit={this.edit}
                                post={this.state.post}
                                postType={this.state.postType}
                                errors={this.state.errors}
                                langCode={this.state.langCode}
                                onRef={::this.handleFieldsRef}
                            />
                        )}
                    </ColumnsSingle>
                </div>
                <Actions
                    remove={{
                        active: this.edit === true && isWritable === true,
                        loader: this.state.loader === 'delete',
                        disabled: this.state.loader !== false,
                        superadmin: this.isSuperadmin && this.state.postType.mode < 3,
                        onClick: ::this.handleDelete,
                    }}
                    active={{
                        active: this.edit === true && isWritable === true ? isActive : null,
                        loader: this.state.loader === 'active',
                        disabled: this.state.loader !== false,
                        superadmin: this.isSuperadmin && this.state.postType.mode < 3,
                        onClick: isActive === true ? ::this.inactivePost : ::this.activePost,
                    }}
                    action={{
                        name:
                            this.edit === true ? (isUpdatable === true ? 'update' : null) : isWritable === true ? 'create' : null,
                        loader: ['create', 'update'].indexOf(this.state.loader) !== -1,
                        disabled: this.state.loader !== false,
                        superadmin: this.isSuperadmin && this.state.postType.mode < 2,
                        onClick: this.edit === true ? ::this.updatePost : ::this.createPost,
                    }}
                />
            </>
        );
    }
}

const optionsBool = [
    { label: Lang.get('words.no'), value: 0 },
    { label: Lang.get('words.yes'), value: 1 },
];

const fieldsModes = {
    description: 'text',
    hidden_at: 'datetime',
    position: 'number',
    post_id: 'posts',
    title: 'text',
    url: 'text',
    visible_at: 'datetime',
};

const fieldsModesKeys = keys(fieldsModes);

const optionsModes = map(fieldsModesKeys, (value) => ({ label: value, value }));

PostPage = withAuth(PostPage);
PostPage = withKeyUpEvent(PostPage);
PostPage = withServer(PostPage);

export default PostPage;
