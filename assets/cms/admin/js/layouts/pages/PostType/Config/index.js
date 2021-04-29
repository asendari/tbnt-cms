'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import get from 'lodash/get';
import has from 'lodash/has';
import head from 'lodash/head';
import isEqual from 'lodash/isEqual';
import keys from 'lodash/keys';
import map from 'lodash/map';
import noop from 'lodash/noop';
import pick from 'lodash/pick';
import reduce from 'lodash/reduce';
import setWith from 'lodash/setWith';
import size from 'lodash/size';
import trim from 'lodash/trim';
import unset from 'lodash/unset';

import getSet from 'lib/js/utils/getSet';
import sortByAttrAlphaNum from 'lib/js/utils/sortByAttrAlphaNum';

import Item from './Item';
import Items from './Items';

import Dialog from '../../../../helpers/dialog';
import Lang from '../../../../helpers/lang';

class ConfigPostTypePage extends React.PureComponent {
    static propTypes = {
        onMount: PropTypes.func,
        getDummyItem: PropTypes.func,
        getErrorsAt: PropTypes.func,
        unsetErrorAt: PropTypes.func,
        items: PropTypes.array,
        posts: PropTypes.array,
        postsTypesKeys: PropTypes.object,
        optionsPostsKeys: PropTypes.object,
        optionsPostsTypes: PropTypes.array,
        errors: PropTypes.array,
    };

    static defaultProps = {
        onMount: noop,
        getDummyItem: noop,
        getErrorsAt: noop,
        unsetErrorAt: noop,
        items: null,
        posts: null,
        postsTypesKeys: null,
        optionsPostsKeys: null,
        optionsPostsTypes: null,
        errors: null,
    };

    state = {
        items: null,
        itemsRef: null,
        optionsPostsIds: null,
        optionsConditions: null,
        optionsConditionsOptions: null,
    };

    static getDerivedStateFromProps(props, state) {
        const newState = cloneDeep(state);

        const items = isEqual(props.items, state.itemsRef) === true ? state.items : cloneDeep(props.items);

        if (items !== null) {
            const conditions = processConditions(items);

            newState.optionsPostsIds = map(processPostsIds(items), ({ id, key }) => ({ label: key, value: id }));
            newState.optionsConditions = map(conditions, ({ id, key }) => ({ label: key, value: id }));
            newState.optionsConditionsOptions = reduce(
                conditions,
                (result, value, key) =>
                    setWith(
                        result,
                        value.key,
                        map(value.items, ({ id, key }) => ({ label: key, value: id })),
                        Object,
                    ),
                {},
            );
        }

        return {
            ...newState,
            items: processItems(items, {
                parentType: null,
                optionsConditions: newState.optionsConditions,
                optionsPostsTypes: props.optionsPostsTypes,
                getErrorsAt: props.getErrorsAt,
            }),
            itemsRef: props.items,
        };
    }

    componentDidMount() {
        this.props.onMount(this);
    }

    getValues() {
        return processValues(this.state.items);
    }

    handleItems(cb = noop) {
        window.setBodyLoading(true);

        this.setState(
            (olState) => {
                const items = cloneDeep(olState.items);

                cb(items);

                return { items };
            },
            () => window.setBodyLoading(false),
        );
    }

    handleItem(item, parent = false, cb = noop) {
        this.handleItems((items) => cb(findItemsById(items, item?.id, parent)));
    }

    handleItemItems(item, parent, cb = noop) {
        item === null
            ? this.handleItems(cb)
            : this.handleItem(item, parent, (source) => cb(parent === true ? source : getSet(source, 'items', [])));
    }

    handleItemConditions(item, cb = noop) {
        item === null ? this.handleItems(cb) : this.handleItem(item, false, (source) => cb(getSet(source, 'conditions', {})));
    }

    handleConfigAdd(item, index, parent = true) {
        this.handleItemItems(item, parent, (items) => items.splice(index, 0, this.props.getDummyItem()));
    }

    handleConfigRemove(item, index, parent = true) {
        Dialog.confirm(Lang.get('post_type.items.fields.delete_confirmation'), {
            onAccept: () => this.handleItemItems(item, parent, (items) => items.splice(index, 1)),
        });
    }

    handleConfigMoveUp(item, index, parent = true) {
        this.handleItemItems(item, parent, (items) => items.splice(index - 1, 0, head(items.splice(index, 1))));
    }

    handleConfigMoveDown(item, index, parent = true) {
        this.handleItemItems(item, parent, (items) => items.splice(index + 1, 0, head(items.splice(index, 1))));
    }

    handleConfigValueChange(item, key, value) {
        this.handleItem(item, false, (source) => setWith(source, key, value, Object));
        this.props.unsetErrorAt(`items.${item?.id}.${key}`);
    }

    handleConditionAdd(item, leftConditions) {
        if (size(leftConditions) !== 0)
            this.handleItemConditions(item, (conditions) => setWith(conditions, head(leftConditions)?.value, [], Object));
    }

    handleConditionRemove(item, key) {
        Dialog.confirm(Lang.get('post_type.items.fields.condition_delete_confirmation'), {
            onAccept: () => this.handleItemConditions(item, (conditions) => unset(conditions, key)),
        });
    }

    handleConditionValueChange(item, oldKey, newKey) {
        this.handleItemConditions(item, (conditions) => {
            unset(conditions, Number(oldKey) || oldKey);
            setWith(conditions, Number(newKey) || newKey, [], Object);
        });
    }

    handleConditionMatchChange(item, key, value) {
        this.handleItemConditions(item, (conditions) => setWith(conditions, Number(key) || key, value, Object));
        this.props.unsetErrorAt(`items.${item?.id}.conditions.${key}`);
    }

    render() {
        return this.renderItems({ items: this.state.items });
    }

    renderItems(props) {
        return (
            <Items
                {...props}
                key={`items-${props.item?.id ?? 0}`}
                onConfigAdd={::this.handleConfigAdd}
                renderItem={::this.renderItem}
            />
        );
    }

    renderItem(props) {
        const { item } = props;

        return (
            <Item
                {...props}
                key={`item-${item?.id ?? 0}`}
                errors={this.props.getErrorsAt(getErrorIndex(item)) ?? null}
                postsSame={item.isValue === false ? this.props.postsSame : null}
                postsTypesKeys={item.canDataType === true ? this.props.postsTypesKeys : null}
                optionsPostsKeys={item.canDataType === true ? this.props.optionsPostsKeys : null}
                optionsPostsTypes={item.canDataType === true ? this.props.optionsPostsTypes : null}
                optionsPostsIds={item.canDataType === true ? this.state.optionsPostsIds : null}
                optionsConditions={item.canDataCondition === true ? this.state.optionsConditions : null}
                optionsConditionsOptions={item.canDataCondition === true ? this.state.optionsConditionsOptions : null}
                onConfigAdd={::this.handleConfigAdd}
                onConfigRemove={::this.handleConfigRemove}
                onConfigMoveUp={::this.handleConfigMoveUp}
                onConfigMoveDown={::this.handleConfigMoveDown}
                onConfigValueChange={::this.handleConfigValueChange}
                onConditionAdd={::this.handleConditionAdd}
                onConditionRemove={::this.handleConditionRemove}
                onConditionValueChange={::this.handleConditionValueChange}
                onConditionMatchChange={::this.handleConditionMatchChange}
                renderItems={::this.renderItems}
            />
        );
    }
}

const defaultType = 'empty';
const defaultDataType = 'radio';
const defaultDataWysiwyg = [
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'insertLink',
    'selectAll',
    'clearFormatting',
    'undo',
    'redo',
];

const getInputIndex = (item, path) => filter([String(get(item, 'id')), path]).join('.') || '';

const getErrorIndex = (item, path) => filter(['items', getInputIndex(item, path)]).join('.') || '';

const hasErrors = (items) =>
    reduce(items, (result, item) => (result === true ? true : item.isError === true ? true : hasErrors(item.items)), false);

const processItems = (items, props) =>
    map(items, (item) => {
        const { parentType, optionsConditions, optionsPostsTypes, getErrorsAt } = props;

        item.items = processItems(item.items, { ...props, parentType: item.type });

        item.inputIndex = getInputIndex(item);
        item.errorIndex = getErrorIndex(item);

        item.isError = getErrorsAt(getErrorIndex(item)) !== null;
        item.isWarning = hasErrors(item.items);

        item.fieldKey = trim(get(item, 'key') || '');
        item.fieldType = get(item, 'type') || defaultType;

        item.isValue = ['checkbox', 'radio', 'select', 'selectmultiple'].indexOf(parentType) !== -1;
        item.isCountable =
            item.fieldType !== 'post' || ['checkbox', 'selectmultiple'].indexOf(get(item, 'config.type', defaultDataType)) !== -1;
        item.isDate = ['date', 'datetime', 'time'].indexOf(item.fieldType) !== -1;
        item.isUnique =
            Number(
                reduce(
                    map(items, 'key'),
                    (result, value, key) => setWith(result, value, get(result, value, 0) + 1, Object),
                    {},
                )?.[item.fieldKey] || 0,
            ) <= 1;
        item.isEmpty = item.fieldKey === '';
        item.isNew = item.new === true;

        item.canDataCount =
            item.isValue === false &&
            item.isCountable === true &&
            ['checkbox', 'rows', 'selectmultiple'].indexOf(item.fieldType) !== -1;
        item.canDataMin =
            item.isValue === false &&
            item.isCountable === true &&
            [
                'checkbox',
                'date',
                'datetime',
                'encrypted',
                'number',
                'rows',
                'selectmultiple',
                'text',
                'textarea',
                'time',
                'wysiwyg',
            ].indexOf(item.fieldType) !== -1;
        item.canDataMax =
            item.isValue === false &&
            item.isCountable === true &&
            [
                'checkbox',
                'date',
                'datetime',
                'encrypted',
                'file',
                'number',
                'rows',
                'selectmultiple',
                'text',
                'textarea',
                'time',
                'wysiwyg',
            ].indexOf(item.fieldType) !== -1;
        item.canDataStep = item.isValue === false && ['number'].indexOf(item.fieldType) !== -1;
        item.canDataType = item.isValue === false && ['post'].indexOf(item.fieldType) !== -1;
        item.canDataAccept = item.isValue === false && ['file'].indexOf(item.fieldType) !== -1;
        item.canDataCast =
            item.isValue === false &&
            ['checkbox', 'encrypted', 'number', 'radio', 'select', 'selectmultiple', 'text'].indexOf(item.fieldType) !== -1;
        item.canDataItems =
            item.isValue === false &&
            ['checkbox', 'group', 'radio', 'rows', 'select', 'selectmultiple'].indexOf(item.fieldType) !== -1;
        item.canDataMode = item.isValue === false && ['empty'].indexOf(item.fieldType) === -1;
        item.canDataRest = item.isValue === false && ['empty', 'group'].indexOf(item.fieldType) === -1;
        item.canDataWysiwyg = item.isValue === false && ['wysiwyg'].indexOf(item.fieldType) !== -1;
        item.canDataCondition = item.isValue === false && optionsConditions?.length !== 0;

        item.fieldConditions = item.canDataCondition === true && get(item, 'conditions', {});
        item.fieldConditionsKeys = item.canDataCondition === true && map(keys(item.fieldConditions), Number);

        if (item.canDataType === true && has(item, 'config.type') === false)
            setWith(item, 'config.type', defaultDataType, Object);
        if (item.canDataCount === true && has(item, 'config.count') === false) setWith(item, 'config.count', 0, Object);
        if (item.canDataMin === true && has(item, 'config.min') === false) setWith(item, 'config.min', 0, Object);
        if (item.canDataMax === true && has(item, 'config.max') === false)
            setWith(item, 'config.max', item.canDataAccept === false ? 0 : 2048, Object);
        if (item.canDataStep === true && has(item, 'config.step') === false) setWith(item, 'config.step', 1, Object);
        if (item.canDataWysiwyg === true && has(item, 'config.wysiwyg') === false)
            setWith(item, 'config.wysiwyg', defaultDataWysiwyg, Object);
        if (item.canDataAccept === true && has(item, 'config.accept') === false)
            setWith(item, 'config.accept', 'jpg,png,svg', Object);
        if (item.canDataType === true && has(item, 'config.posts.type') === false)
            setWith(item, 'config.posts.type', head(optionsPostsTypes)?.value, Object);
        if (item.canDataType === true && (has(item, 'config.posts.id') === false || !get(item, 'config.posts.id'))) {
            unset(item, 'config.posts.id');
            unset(item, 'config.posts.key');
            unset(item, 'config.posts.label');
        }
        if (item.canDataType === true && (has(item, 'config.posts.key') === false || !get(item, 'config.posts.key'))) {
            unset(item, 'config.posts.key');
            unset(item, 'config.posts.label');
        }
        if (item.canDataType === true && (has(item, 'config.posts.label') === false || !get(item, 'config.posts.label')))
            unset(item, 'config.posts.label');
        if (item.canDataMode === true && has(item, 'mode') === false) setWith(item, 'mode', 2, Object);
        if (item.canDataRest === true && has(item, 'is_required') === false) setWith(item, 'is_required', 0, Object);
        if (item.canDataRest === true && has(item, 'is_translatable') === false) setWith(item, 'is_translatable', 0, Object);

        return item;
    });

const removeNew = (items) => filter(items, (item) => item.new !== true);

const processValues = (items) =>
    map(items, (item) => ({
        conditions: item.conditions,
        config: item.config,
        id: item.id,
        is_required: item.is_required,
        is_translatable: item.is_translatable,
        items: processValues(item.items),
        key: item.key,
        label: item.label,
        mode: item.mode,
        position: item.position,
        restrictions: item.restrictions,
        type: item.type,
    }));

const processPostsIds = (items) =>
    reduce(
        items,
        (result, value) =>
            filter(
                result.concat(
                    ['post'].indexOf(value.type) === -1 ? [] : [value],
                    ['group', 'rows'].indexOf(value.type) === -1 ? [] : processPostsIds(value.items),
                ),
            ),
        [],
    );

const processConditions = (items) =>
    reduce(
        removeNew(items),
        (result, value) =>
            filter(
                result.concat(
                    ['checkbox', 'radio', 'select', 'selectmultiple'].indexOf(value.type) === -1
                        ? []
                        : [{ ...value, items: removeNew(value.items) }],
                    ['group', 'rows'].indexOf(value.type) === -1 ? [] : processConditions(value.items),
                ),
            ),
        [],
    );

const processPostsKeys = (items) =>
    reduce(items, (result, value, key) => filter(result.concat([value.key], processPostsKeys(value.items))), []);

const findItemsById = (items, targetId, parent = true) =>
    reduce(
        items,
        (result, item) =>
            result ?? (item.id == targetId ? (parent === true ? items : item) : findItemsById(item.items, targetId, parent)),
        null,
    );

export default ConfigPostTypePage;
