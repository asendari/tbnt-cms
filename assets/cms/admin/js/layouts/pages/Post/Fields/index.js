'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';
import difference from 'lodash/difference';
import fill from 'lodash/fill';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import uniq from 'lodash/uniq';

import isArray from 'lib/js/utils/isArray';
import nextTick from 'lib/js/utils/nextTick';
import uniqId from 'lib/js/utils/uniqId';

import withServer from '../../../../components/hoc/Server';
import withTimeout from 'lib/js/components/hoc/Timeout';

import ColumnsDouble from '../../../../components/custom/ColumnsDouble';

import Field from './Field';
import Group from './Group';
import Rows from './Rows';

import Dialog from '../../../../helpers/dialog';
import Form from '../../../../helpers/form';
import Lang from '../../../../helpers/lang';
import User from '../../../../helpers/user';

import LangConfig from '../../../../config/lang';

const defaultLangCode = LangConfig.get('default_code');

class FieldsPostPage extends React.PureComponent {
    static propTypes = {
        onRef: PropTypes.func,
        post: PropTypes.object,
        postType: PropTypes.object,
        errors: PropTypes.object,
        langCode: PropTypes.string,
    };

    static defaultProps = {
        onRef: noop,
        post: null,
        postType: null,
        errors: {},
        langCode: '',
    };

    state = {
        items: [],
        conditions: [],
        postsOptions: {},
        postRef: null,
        postTypeRef: null,
    };

    form = new Form();

    fetched = [];
    fetchedRefs = {};

    static getDerivedStateFromProps(props, state) {
        if (isEqual(props.post, state.postRef) === true && isEqual(props.postType, state.postTypeRef) === true) return null;

        return {
            items: map(props.postType.items ?? [], (it) => initItem(it, cloneDeep(props.post)?.items ?? {})),
            conditions: reduceConditions(props.postType?.items),
            postRef: props.post,
            postTypeRef: props.postType,
        };
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    loadPostOptions(config) {
        const loadConfig = config.config?.posts ?? {};
        const typeId = Number(loadConfig.id) || null;
        const postType = (typeId === null ? loadConfig.type : this.getValueFromTypeItemId(config, typeId)) ?? null;
        const ref = getValueRef(config);

        if (this.state.postsOptions?.[ref] !== undefined) return this.state.postsOptions[ref];
        if (postType === null || this.fetched.indexOf(ref) !== -1) return;

        this.fetched.push(ref);

        const done = (postType) => {
            const refPostType = this.fetchedRefs[postType];

            if (refPostType === null) return;

            map(refPostType.refs, ({ loadConfig, typeId }, ref) => {
                const items = typeId === null ? refPostType.post : get(refPostType.post?.items, loadConfig.key);
                const itemsAreRows = isArray(items) === true;

                const options = map(itemsAreRows === true ? items : items?.value, (option) => ({
                    value: typeId === null ? String(option.id) : itemsAreRows === true ? option.id : option,
                    label:
                        typeId === null
                            ? option.reference
                            : itemsAreRows === true
                            ? get(option.items, loadConfig.label)?.value
                            : option,
                }));

                this.setState((oldState) => ({
                    postsOptions: merge({}, oldState.postsOptions, { [ref]: options }),
                }));
            });
        };

        if (this.fetchedRefs[postType] === undefined) {
            this.fetchedRefs[postType] = { post: null, refs: { [ref]: { loadConfig, typeId } } };

            this.props.server.fetch(`posts/${postType}`, {
                method: 'post',
                params: { page_count: -1 },
                data: { order: 'reference-0' },
                success: (response, { data }) => {
                    this.fetchedRefs[postType].post = data;

                    done(postType);
                },
            });
        } else {
            this.fetchedRefs[postType].refs[ref] = { loadConfig, typeId };

            nextTick(() => done(postType));
        }
    }

    getValues() {
        const processItems = (items, source = {}) =>
            reduce(
                items,
                (result, config) => {
                    if (this.isFieldVisible(config) === false) return result;

                    const item = {
                        key: config.key,
                        post_item_id: 0,
                        post_type_item_id: config.id,
                        type: config.type,
                        ...source,
                    };

                    if (config.type === 'group') {
                        item.id = config.value?.id;
                        item.items = keyBy(processItems(config.value.items, { post_item_id: config.value.id }), 'key');
                    } else if (config.type === 'rows') {
                        item.value = map(config.rows, (row) => ({
                            ...item,
                            id: row.id,
                            items: keyBy(processItems(row.items, { post_item_id: row.id }), 'key'),
                        }));
                    } else if (config.type === 'empty') {
                        return result;
                    } else {
                        item.id = config.value?.id;
                        item.value = this.form.getValue(String(item.id));
                    }

                    return { ...result, [item.key]: item };
                },
                {},
            );

        return processItems(this.state.items);
    }

    getPostFromTypeItemId(config, typeItemId) {
        if (config.value?.id === undefined) return null;

        return (
            find(findItemsByValue(this.state.items, config.value.id), (item) => String(item.id) === String(typeItemId)) ||
            findItemsById(this.state.items, typeItemId, false)
        );
    }

    getValueFromTypeItemId(config, typeItemId) {
        const post = this.getPostFromTypeItemId(config, typeItemId);

        if (post === null) return null;

        return this.form.getValue(String(post?.value?.id), post?.value?.value);
    }

    isFieldAuthorized(config) {
        return User.isAuthorized(config.mode);
    }

    isFieldConditioned(config) {
        return (
            (config.conditions ?? []).length !== 0 &&
            filter(config.conditions, (condition) => {
                // Note to myself:
                // here can happen a bug caused by different casted value
                // ...but right now, I'm ignoring this warning

                return condition.value == this.getValueFromTypeItemId(config, condition.post_type_item_id_match);
            }).length !== config.conditions.length
        );
    }

    isFieldVisible(config) {
        return this.isFieldAuthorized(config) === true && this.isFieldConditioned(config) === false;
    }

    handleField(config, cb = noop) {
        this.setState((olState) => {
            const items = cloneDeep(olState.items);
            const source = findItemsByValue(items, config.value?.id, false);

            cb(source);

            return { items };
        });
    }

    handleFieldRow(config, cb = noop) {
        this.handleField(config, (source) => cb(source?.rows ?? []));
    }

    handleFieldRowAdd(config, index) {
        this.handleFieldRow(config, (rows) =>
            rows.splice(index, 0, {
                id: getDummyItem(config).id,
                items: map(config.items ?? [], (it) => initItem(it)),
            }),
        );
    }

    handleFieldRowRemove(config, index) {
        Dialog.confirm(Lang.get('post.fields.delete_confirmation'), {
            onAccept: () =>
                this.handleFieldRow(
                    config,
                    (rows) =>
                        rows[index] !== undefined &&
                        rows.length > (config.config?.count ?? config.config?.min ?? 0) &&
                        rows.splice(index, 1),
                ),
        });
    }

    handleFieldRowMoveUp(config, index) {
        this.handleFieldRow(config, (rows) => rows.splice(index - 1, 0, rows.splice(index, 1)[0]));
    }

    handleFieldRowMoveDown(config, index) {
        this.handleFieldRow(config, (rows) => rows.splice(index + 1, 0, rows.splice(index, 1)[0]));
    }

    handleFieldChange(config, value) {
        if (this.state.conditions.values.indexOf(config.id) !== -1) {
            this.handleField(config, (source) => set(source, 'value.value', value));
        }

        if (this.state.conditions.posts[config.id] !== undefined) {
            this.fetched = difference(this.fetched, this.state.conditions.posts[config.id]);
            this.setState((oldState) => ({
                postsOptions: omit(oldState.postsOptions, this.state.conditions.posts[config.id]),
            }));
        }
    }

    render() {
        return <ColumnsDouble>{map(this.state.items, ::this.renderItem)}</ColumnsDouble>;
    }

    renderItem(item) {
        if (this.isFieldVisible(item) === true) {
            if (item.type === 'group') {
                return <Group key={`group-${item.id}`} config={item} renderItem={::this.renderItem} />;
            } else if (item.type === 'rows') {
                return (
                    <Rows
                        key={`rows-${item.id}`}
                        config={item}
                        onFieldRowAdd={::this.handleFieldRowAdd}
                        onFieldRowRemove={::this.handleFieldRowRemove}
                        onFieldRowMoveUp={::this.handleFieldRowMoveUp}
                        onFieldRowMoveDown={::this.handleFieldRowMoveDown}
                        renderItem={::this.renderItem}
                    />
                );
            } else {
                return (
                    <Field
                        key={`field-${item.id}`}
                        config={item}
                        postsOptions={this.loadPostOptions(item)}
                        conditions={this.state.conditions}
                        errors={this.props.errors[`fields.${item.value?.id}`]}
                        langCode={this.props.langCode}
                        form={this.form}
                        onFieldChange={::this.handleFieldChange}
                    />
                );
            }
        }

        return null;
    }
}

const initItem = (config, source = {}) => {
    const item = cloneDeep(config);
    item.value = getDummyItem(config);

    if (config.type === 'group') {
        item.value = {
            id: get(source, config.key, item.value).id,
            items: map(config.items, (it) => initItem(it, cloneDeep(get(source, config.key)?.items))),
        };
    } else if (config.type === 'rows') {
        item.rows = map(initRows(config, source), (row) => ({
            id: row.id,
            items: map(config.items, (it) => initItem(it, row.items)),
        }));
    } else {
        item.value = cloneDeep(get(source, config.key, merge({}, item.value, { value: config.config?.default || null })));
    }

    return item;
};

const initRows = (config, source = {}) => {
    const fixedRows = Number(config.config?.count) || null;
    const maxRows = (fixedRows ?? Number(config.config?.max)) || null;
    const minRows = fixedRows ?? Math.max(0, Number(config.config?.min) || 0);

    const rows = cloneDeep(get(source, config.key) || []);

    map(fill(Array(Math.max(0, minRows - rows.length)), null), () => {
        const dummyItem = getDummyItem(config);
        const dummyItems = getDummyItems(config.items);

        rows.push({ id: dummyItem.id, items: dummyItems });
    });

    if (maxRows !== null) rows.splice(maxRows);

    return rows;
};

const getDummyItem = (item, defaults = {}) => ({
    id: `new${uniqId()}`,
    key: item.key,
    type: item.type,
    value: null,
    ...defaults,
});
const getDummyItems = (items) => map(items, (it) => (it.type === 'rows' ? [] : getDummyItem(it)));

const findItemsByIdHelper = (item, targetId, parent = true) =>
    item.type === 'rows'
        ? reduce(item.rows, (result, row) => result ?? findItemsById(row.items, targetId, parent), null)
        : findItemsById(item.value?.items, targetId, parent);
const findItemsById = (items, targetId, parent = true) =>
    reduce(
        items,
        (result, item) =>
            result ?? (item.id === targetId ? (parent === true ? items : item) : findItemsByIdHelper(item, targetId, parent)),
        null,
    );

const findItemsByValueHelper = (item, targetId, parent = true) =>
    item.type === 'rows'
        ? reduce(item.rows, (result, row) => result ?? findItemsByValue(row.items, targetId, parent), null)
        : findItemsByValue(item.value?.items, targetId, parent);
const findItemsByValue = (items, targetId, parent = true) =>
    reduce(
        items,
        (result, item) =>
            result ??
            (item.value?.id === targetId ? (parent === true ? items : item) : findItemsByValueHelper(item, targetId, parent)),
        null,
    );

const getValueRef = (config) => JSON.stringify(config.config?.posts ?? {});

const reduceConditions = (items) =>
    reduce(
        items,
        (result, it) => {
            const subConditions = reduceConditions(it.items);

            result.values = uniq(result.values.concat(map(it.conditions ?? [], 'post_type_item_id_match'), subConditions.values));

            if (it.config?.posts?.id !== undefined) {
                if (result.posts[it.config.posts.id] === undefined) result.posts[it.config.posts.id] = [];

                result.posts[it.config.posts.id].push(getValueRef(it));
            }

            result.posts = mergeWith({}, result.posts, subConditions.posts, (obj, src) =>
                isArray(obj) ? obj.concat(src) : undefined,
            );

            return result;
        },
        { values: [], posts: {} },
    );

FieldsPostPage = withServer(FieldsPostPage);
FieldsPostPage = withTimeout(FieldsPostPage);

export default FieldsPostPage;
