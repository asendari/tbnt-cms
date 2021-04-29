'use strict';

import React from 'react';
import { orderBy } from 'natural-orderby';

import cloneDeep from 'lodash/cloneDeep';
import difference from 'lodash/difference';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';
import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import keys from 'lodash/keys';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import reduce from 'lodash/reduce';
import setWith from 'lodash/setWith';
import size from 'lodash/size';
import unset from 'lodash/unset';

import flatten from 'lib/js/utils/flatten';
import fromKeysPath from 'lib/js/utils/fromKeysPath';
import replaceKey from 'lib/js/utils/replaceKey';
import sortKeys from 'lib/js/utils/sortKeys';
import toBool from 'lib/js/utils/toBool';
import uniqId from 'lib/js/utils/uniqId';

import withAuth from '../../../components/hoc/Auth';
import withKeyUpEvent from 'lib/js/components/hoc/KeyUpEvent';
import withServer from '../../../components/hoc/Server';
import withSuperadmin from '../../../components/hoc/Superadmin';
import withTimeout from 'lib/js/components/hoc/Timeout';

import Page from '../../../components/layout/Page';

import Actions from '../../../components/custom/Actions';
import Card from '../../../components/custom/Card';
import ColumnsDouble from '../../../components/custom/ColumnsDouble';
import ColumnsSingle from '../../../components/custom/ColumnsSingle';
import ColumnsSingleSmall from '../../../components/custom/ColumnsSingleSmall';
import Header from '../../../components/custom/Header';

import Input from '../../../components/base/Input';

import CardOverrides from './CardOverrides';
import Config from './Config';

import Cache from '../../../helpers/cache';
import Dialog from '../../../helpers/dialog';
import Form from '../../../helpers/form';
import Lang from '../../../helpers/lang';
import Notification from '../../../helpers/notification';

const cacheItemsCreated = 'postsTypes:itemCreated';
const cacheItemsUpdated = 'postsTypes:itemUpdated';
const cacheItemsDeleted = 'postsTypes:itemDeleted';

class PostTypePage extends React.Component {
    postTypeId = this.props.match.params?.id || 0;

    edit = this.postTypeId !== 'new';

    state = {
        postType: null,
        postTypeRef: null,
        postTypeConfig: null,
        posts: null,
        postsTypes: null,
        postsTypesKeys: null,
        pages: null,
        optionsPostsKeys: null,
        optionsPostsTypes: null,
        errors: null,
        errorsObject: null,
        loader: false,
        error: false,
    };

    form = new Form(this, 'postTypeConfig', {
        onChange: ::this.onFormState,
    });

    items = null;

    notificationLoading = null;

    waitingItems = false;

    static getDerivedStateFromProps(props, state) {
        if (isEqual(state.postType, state.postTypeRef) === true) return null;

        const postTypeConfig = cloneDeep(state.postType);

        postTypeConfig.items = processConfig(postTypeConfig.items);

        return { postTypeConfig, postTypeRef: state.postType };
    }

    componentDidMount() {
        if (this.edit === true) this.fetchPostType();
        else this.onPostType();
    }

    onPostType() {
        this.fetchPostsTypes();

        this.props.keyUpEvent.add(::this.handleKeyUp);
    }

    onFormState(state, errors) {
        errors = state === 'errors' ? errors : null;

        this.setState({ errors, errorsObject: fromKeysPath(errors) });
    }

    fetchPosts() {
        this.props.server.fetch('posts', {
            method: 'post',
            params: { page_count: -1 },
            data: { order: 'reference-0' },
            success: (response, { data: posts }) => {
                this.setState((oldState) => {
                    posts = map(posts, (post) => ({
                        label: post.reference,
                        value: String(post.id),
                        postType: find(oldState.postsTypes, (postType) => postType.id == post.post_type_id) || null,
                        post,
                    }));

                    return {
                        posts,
                        postsSame: filter(posts, (post) => post.post?.post_type_id == this.postTypeId),
                        pages: filter(posts, (post) => post.postType?.is_page === true),
                    };
                });
            },
        });
    }

    fetchPostsTypes() {
        this.props.server.fetch('posts-types', {
            method: 'post',
            params: { page_count: -1 },
            // data: { exclude_ids: this.postTypeId },
            success: (response, { data: postsTypes }) => {
                map(postsTypes, (postType) => Cache.set(`posts_types.${postType.type}`, postType));

                postsTypes = keyBy(orderBy(postsTypes, 'type'), 'type');

                this.setState(
                    {
                        postsTypes,
                        postsTypesKeys: reduce(
                            postsTypes,
                            (result, value, key) => merge(result, keyBy(processPostsTypesKeys(value.items), 'key')),
                            {},
                        ),
                        optionsPostsKeys: mapValues(postsTypes, (postType) =>
                            map(processPostsTypesKeys(postType.items), ({ key: label }) => ({
                                label,
                                value: label,
                            })),
                        ),
                        optionsPostsTypes: map(postsTypes, ({ type: label }) => ({ label, value: label })),
                        loader: false,
                    },
                    ::this.fetchPosts,
                );
            },
        });
    }

    fetchPostType() {
        this.setState({ loader: true });

        this.props.server.fetch(`posts-types/${this.postTypeId}`, {
            method: 'post',
            success: (response, { data: postType }) => {
                Cache.set(`posts_types.${postType.type}`, postType);

                this.setState({ postType }, ::this.onPostType);
            },
            error: (error, data) => {
                this.setState({ loader: false, error: true });
            },
        });
    }

    createPostType() {
        if (this.items === null || this.state.loader !== false) return;

        this.notificationLoading = Notification.success(Lang.get('inputs.message_create_loading'), {
            hideTimeout: 60 * 1000 * 2,
        });

        this.setState({ loader: 'create' });

        this.props.server.fetch('posts-types/create', {
            method: 'post',
            data: this.getValues(),
            formHelper: this.form,
            alert: true,
            success: (response, { data: postType }) => {
                this.setChangedCache(cacheItemsCreated, postType);

                this.props.history.replace(Lang.router('post_type').replace(':id', postType.id));

                this.notificationLoading?.hide();

                Notification.success(Lang.get('post_type.messages.create_success'));
            },
            error: (error, data) => {
                this.setState({ loader: false }, () => {
                    this.notificationLoading?.hide();
                });
            },
        });
    }

    updatePostType() {
        if (this.items === null || this.state.loader !== false) return;

        this.notificationLoading = Notification.success(Lang.get('inputs.message_update_loading'), {
            hideTimeout: 60 * 1000 * 2,
        });

        this.setState({ loader: 'update' });

        this.props.server.fetch(`posts-types/${this.postTypeId}/update`, {
            method: 'post',
            data: this.getValues(),
            formHelper: this.form,
            alert: true,
            success: (response, { data: postType }) => {
                this.setChangedCache(cacheItemsUpdated, postType, this.state.postType);

                this.setState({ loader: false, postType }, () => {
                    this.form.resetValues();
                    this.notificationLoading?.hide();

                    Notification.success(Lang.get('post_type.messages.update_success'));
                });
            },
            error: (error, data) => {
                this.setState({ loader: false }, () => {
                    this.notificationLoading?.hide();
                });
            },
        });
    }

    activePostType() {
        if (this.state.loader !== false) return;

        this.setState({ loader: 'active' });

        this.props.server.fetch(`posts-types/${this.postTypeId}/active`, {
            method: 'post',
            alert: true,
            success: (response, { data: postType }) => {
                this.setChangedCache(cacheItemsUpdated, postType, this.state.postType);

                this.setState({ loader: false, postType }, () => {
                    Notification.success(Lang.get('post_type.messages.update_success'));
                });
            },
            error: (error, data) => {
                this.setState({ loader: false });
            },
        });
    }

    inactivePostType() {
        if (this.state.loader !== false) return;

        this.setState({ loader: 'active' });

        this.props.server.fetch(`posts-types/${this.postTypeId}/inactive`, {
            method: 'post',
            alert: true,
            success: (response, { data: postType }) => {
                this.setChangedCache(cacheItemsUpdated, postType, this.state.postType);

                this.setState({ loader: false, postType }, () => {
                    Notification.success(Lang.get('post_type.messages.update_success'));
                });
            },
            error: (error, data) => {
                this.setState({ loader: false });
            },
        });
    }

    deletePostType() {
        if (this.state.loader !== false) return;

        this.setState({ loader: 'delete' });

        this.props.server.fetch(`posts-types/${this.postTypeId}/delete`, {
            method: 'post',
            alert: true,
            success: (response, { data: postType }) => {
                this.setChangedCache(cacheItemsDeleted, postType);

                this.props.history.replace(Lang.router('posts_types'));

                Notification.success(Lang.get('post_type.messages.delete_success'));
            },
            error: (error, data) => {
                this.setState({ loader: false });
            },
        });
    }

    setChangedCache(cacheItems, item, oldItem = null) {
        if (oldItem !== null) Cache.unset(`posts_types.${oldItem.type}`);

        if (cacheItems === cacheItemsDeleted) Cache.unset(`posts_types.${item.type}`);
        else Cache.set(`posts_types.${item.type}`, item);

        Cache.set(cacheItems, Cache.get(cacheItems, []).concat([item]));
    }

    getValues() {
        return {
            ...merge(
                {},
                this.state.postTypeConfig,
                fromKeysPath(
                    pick(this.form.getValues(), ['type', 'label', 'has_key', 'is_page', 'is_loaded', 'mode', 'config.order']),
                ),
            ),
            items: this.items.getValues(),
        };
    }

    getErrorsAt(path) {
        const errors = get(this.state.errorsObject, path, {});

        return size(errors) === 0 ? null : errors;
    }

    flattenErrorsAt(path) {
        const errors = flatten(this.getErrorsAt(path));

        return errors.length === 0 ? null : errors;
    }

    unsetErrorAt(path) {
        this.setState((oldState) => {
            const errors = cloneDeep(oldState.errors);

            unset(errors, path);

            return { errors, errorsObject: fromKeysPath(errors) };
        });
    }

    handleDelete() {
        Dialog.confirm(Lang.get('post_type.messages.delete_confirmation'), { onAccept: ::this.deletePostType });
    }

    handleCreateUpdate() {
        this.waitingItems = this.items === null;

        if (this.waitingItems === false) this.createOrUpdate();
        else window.setBodyLoading(true);
    }

    createOrUpdate() {
        if (this.items !== null)
            this.props.timeout.set(() => {
                this.edit === false ? this.createPostType() : this.updatePostType();
                window.setBodyLoading(false);
            }, 700);
    }

    handleKeyUp(keyCode, keyChar, specialKeys) {
        if (keyChar === 's' && specialKeys.ctrl === true) this.handleCreateUpdate();
    }

    handleValue(cb = noop) {
        this.setState((olState) => {
            const postTypeConfig = cloneDeep(olState.postTypeConfig ?? {});

            cb(postTypeConfig);

            return { postTypeConfig };
        });
    }

    handleValueChange(key, value) {
        this.handleValue((postTypeConfig) => setWith(postTypeConfig, key, value, Object));
    }

    handleIsPageChange(value) {
        this.handleValueChange('is_page', value);
    }

    handleRequiredChange(value) {
        this.handleValueChange('config.required', value);
    }

    handleModesChange(value) {
        this.handleValueChange(
            'config.modes',
            reduce(value, (r, v) => ({ ...r, [v]: 0 }), {}),
        );
    }

    handleOverrideAdd() {
        this.handleValue((postTypeConfig) =>
            setWith(
                postTypeConfig,
                `config.override.${head(difference(allOverridableFieldsKeys, keys(get(postTypeConfig, 'config.override'))))}`,
                '',
                Object,
            ),
        );
    }

    handleOverrideRemove(key) {
        Dialog.confirm(Lang.get('post_type.fields.delete_confirmation'), {
            onAccept: () => this.handleValue((postTypeConfig) => unset(postTypeConfig, `config.override.${key}`)),
        });
    }

    handleOverrideKeyChange(newKey, oldKey) {
        this.handleValue((postTypeConfig) =>
            setWith(
                postTypeConfig,
                'config.override',
                replaceKey(get(postTypeConfig, 'config.override'), oldKey, newKey),
                Object,
            ),
        );
    }

    handleOverrideValueChange(value, key) {
        this.handleValue((postTypeConfig) => setWith(postTypeConfig, `config.override.${key}`, value, Object));
    }

    handleItemsMount(ref) {
        this.items = ref;

        if (this.waitingItems === true) this.createOrUpdate();

        this.waitingItems = false;
    }

    render() {
        const seo = {
            title:
                this.edit === true
                    ? this.state.loader === true
                        ? Lang.get('words.loading_dot')
                        : Lang.get('post_type.seo.title_update', this.state.postTypeConfig?.type ?? '')
                    : Lang.get('post_type.seo.title_create'),
        };

        return (
            <Page id="post-type" helmet={seo} menu={seo}>
                {this.renderContent()}
            </Page>
        );
    }

    renderContent() {
        const firstLoader = this.edit === true && this.state.loader === true && this.state.postTypeConfig === null;

        const isActive = this.form.getState('is_active', false);

        const dataRequired = this.form.getState('config.required', []);
        const dataModes = keys(this.form.getState('config.modes', {}));
        const dataOverride = this.form.getState('config.override', {});

        const optionsFields =
            toBool(this.form.getState('is_page')) === true ? optionsAllOverridableFields : optionsOverridableFields;
        const optionsRequired = filter(optionsFields, (field) => dataModes.indexOf(field.value) === -1);
        const optionsModes = filter(optionsFields, (field) => dataRequired.indexOf(field.value) === -1);

        return (
            <>
                <Header>
                    <Header.Title>
                        {this.edit === true
                            ? this.state.loader === true
                                ? Lang.get('words.loading_dot')
                                : Lang.get('post_type.header.title_update', this.state.postTypeConfig?.type ?? '', isActive)
                            : Lang.get('post_type.header.title_create')}
                    </Header.Title>
                </Header>
                <div className="container padding-24-left padding-24-right padding-40-top padding-40-bottom">
                    <ColumnsSingle>
                        <ColumnsDouble>
                            <Card>
                                <Card.Header>{Lang.get('post_type.cards.options')}</Card.Header>
                                <Card.Body loader={firstLoader === true}>
                                    <ColumnsSingleSmall>
                                        <Input
                                            type="text"
                                            name="type"
                                            label={Lang.get('post_type.fields.type')}
                                            initialValue={this.form.getState('type')}
                                            formHelper={this.form}
                                        />
                                        <Input
                                            type="text"
                                            name="label"
                                            label={Lang.get('post_type.fields.label')}
                                            initialValue={this.form.getState('label')}
                                            formHelper={this.form}
                                        />
                                        <Input
                                            type="select"
                                            name="mode"
                                            label={Lang.get('post_type.fields.mode')}
                                            input={{ options: optionsMode }}
                                            initialValue={Number(this.form.getState('mode', head(optionsMode)?.value))}
                                            formHelper={this.form}
                                        />
                                        <Input
                                            type="select"
                                            name="has_key"
                                            label={Lang.get('post_type.fields.has_key')}
                                            input={{ options: optionsBool }}
                                            initialValue={Number(this.form.getState('has_key', head(optionsBool)?.value))}
                                            formHelper={this.form}
                                        />
                                        <Input
                                            type="select"
                                            name="is_page"
                                            label={Lang.get('post_type.fields.is_page')}
                                            input={{ options: optionsBool }}
                                            initialValue={Number(this.form.getState('is_page', 0))}
                                            formHelper={this.form}
                                            onChange={::this.handleIsPageChange}
                                        />
                                        <Input
                                            type="select"
                                            name="is_loaded"
                                            label={Lang.get('post_type.fields.is_loaded')}
                                            input={{ options: optionsBool }}
                                            initialValue={Number(this.form.getState('is_loaded', 0))}
                                            formHelper={this.form}
                                        />
                                        <Input
                                            type="select"
                                            name="config.order"
                                            label={Lang.get('post_type.fields.order')}
                                            input={{ options: optionsOrders }}
                                            initialValue={this.form.getState('config.order', head(optionsOrders)?.value)}
                                            error={this.flattenErrorsAt('config.order')}
                                            formHelper={this.form}
                                        />
                                        <Input
                                            type="selectMultiple"
                                            name="config.required"
                                            label={Lang.get('post_type.fields.required')}
                                            input={{ options: optionsRequired }}
                                            initialValue={dataRequired}
                                            error={this.flattenErrorsAt('config.required')}
                                            formHelper={this.form}
                                            onChange={::this.handleRequiredChange}
                                        />
                                        <Input
                                            type="selectMultiple"
                                            name="config.modes"
                                            label={Lang.get('post_type.fields.modes')}
                                            input={{ options: optionsModes }}
                                            initialValue={dataModes}
                                            error={this.flattenErrorsAt('config.modes')}
                                            formHelper={this.form}
                                            onChange={::this.handleModesChange}
                                        />
                                    </ColumnsSingleSmall>
                                </Card.Body>
                            </Card>
                            <ColumnsSingle>
                                {this.edit === true && (
                                    <Card>
                                        <Card.Header>{Lang.get('post_type.cards.details')}</Card.Header>
                                        <Card.Body loader={firstLoader === true}>
                                            <ColumnsSingleSmall>
                                                <Input
                                                    type="datetime"
                                                    label={Lang.get('post_type.fields.created_at')}
                                                    readOnly={true}
                                                    initialValue={this.form.getState('created_at')}
                                                />
                                                <Input
                                                    type="datetime"
                                                    label={Lang.get('post_type.fields.updated_at')}
                                                    readOnly={true}
                                                    initialValue={this.form.getState('updated_at')}
                                                />
                                            </ColumnsSingleSmall>
                                        </Card.Body>
                                    </Card>
                                )}

                                <CardOverrides
                                    overrides={dataOverride}
                                    allFields={allOverridableFields}
                                    allFieldsKeys={allOverridableFieldsKeys}
                                    loader={firstLoader}
                                    pages={this.state.pages}
                                    errors={this.state.errors}
                                    form={this.form}
                                    onAdd={::this.handleOverrideAdd}
                                    onRemove={::this.handleOverrideRemove}
                                    onKeyChange={::this.handleOverrideKeyChange}
                                    onValueChange={::this.handleOverrideValueChange}
                                />
                            </ColumnsSingle>
                        </ColumnsDouble>

                        {(this.state.posts === null && (
                            <Card>
                                <Card.Body loader={true} />
                            </Card>
                        )) || (
                            <Config
                                items={this.state.postTypeConfig?.items}
                                posts={this.state.posts}
                                postsSame={this.state.postsSame}
                                postsTypesKeys={this.state.postsTypesKeys}
                                optionsPostsKeys={this.state.optionsPostsKeys}
                                optionsPostsTypes={this.state.optionsPostsTypes}
                                getDummyItem={getDummyItem}
                                getErrorsAt={::this.getErrorsAt}
                                unsetErrorAt={::this.unsetErrorAt}
                                onMount={::this.handleItemsMount}
                            />
                        )}
                    </ColumnsSingle>
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
                        onClick: isActive === true ? ::this.inactivePostType : ::this.activePostType,
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

const ordersKeys = {
    'created_at-1': Lang.get('pagination.orders.created_at_1'),
    'created_at-0': Lang.get('pagination.orders.created_at_0'),
    'updated_at-1': Lang.get('pagination.orders.updated_at_1'),
    'updated_at-0': Lang.get('pagination.orders.updated_at_0'),
    'reference-1': Lang.get('pagination.orders.reference_1'),
    'reference-0': Lang.get('pagination.orders.reference_0'),
};

const pageFields = {
    description: 'text',
    post_id: 'posts',
    title: 'text',
    url: 'text',
};

const overridableFields = {
    hidden_at: 'datetime',
    position: 'number',
    visible_at: 'datetime',
};

const allOverridableFields = sortKeys({
    ...pageFields,
    ...overridableFields,
});

const overridableFieldsKeys = keys(overridableFields);
const allOverridableFieldsKeys = keys(allOverridableFields);

const optionsBool = [
    { label: Lang.get('words.no'), value: 0 },
    { label: Lang.get('words.yes'), value: 1 },
];

const optionsMode = [
    { label: Lang.get('post_type.fields.read'), value: 1 },
    { label: Lang.get('post_type.fields.update'), value: 2 },
    { label: Lang.get('post_type.fields.write'), value: 3 },
];

const optionsOverridableFields = map(overridableFieldsKeys, (value) => ({ label: value, value }));
const optionsAllOverridableFields = map(allOverridableFieldsKeys, (value) => ({ label: value, value }));

const optionsOrders = map(ordersKeys, (label, value) => ({ label, value }));

const processConfig = (items) =>
    map(items, (item) => {
        item.conditions = reduce(
            item.conditions ?? {},
            (result, value, key) =>
                setWith(
                    result,
                    value.post_type_item_id_match,
                    get(result, value.post_type_item_id_match, []).concat(value.post_type_item_id_value),
                    Array,
                ),
            {},
        );
        item.config = item.config ?? {};
        item.items = processConfig(item.items);
        item.restrictions = map(item.restrictions, 'post_id');

        return item;
    });

const processPostsTypesKeys = (items) =>
    reduce(
        items,
        (result, value, key) =>
            filter(
                result.concat(
                    ['checkbox', 'rows', 'selectmultiple'].indexOf(value.type) === -1 ? [] : [value],
                    ['group', 'rows'].indexOf(value.type) === -1 ? [] : processPostsTypesKeys(value.items),
                ),
            ),
        [],
    );

const getDummyItem = () => ({
    config: {},
    id: `new-${uniqId()}`,
    items: [],
    key: '',
    type: 'empty',
    new: true,
});

PostTypePage = withAuth(PostTypePage);
PostTypePage = withKeyUpEvent(PostTypePage);
PostTypePage = withServer(PostTypePage);
PostTypePage = withSuperadmin(PostTypePage);
PostTypePage = withTimeout(PostTypePage);

export default PostTypePage;
