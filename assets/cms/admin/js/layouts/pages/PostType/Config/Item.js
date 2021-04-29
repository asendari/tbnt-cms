'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import Card from '../../../../components/custom/Card';
import ColumnsDouble from '../../../../components/custom/ColumnsDouble';
import ColumnsSingle from '../../../../components/custom/ColumnsSingle';
import ColumnsSingleSmall from '../../../../components/custom/ColumnsSingleSmall';

import SVGAdd from '../../../../components/svg/add';
import SVGArrowUp from '../../../../components/svg/arrow-up';
import SVGArrowDown from '../../../../components/svg/arrow-down';
import SVGTrash from '../../../../components/svg/trash';

import CardConditions from './CardConditions';
import Input from './Input';

import Lang from '../../../../helpers/lang';
import Styles from '../../../../helpers/styles';

class ItemConfigPostTypePage extends React.PureComponent {
    static propTypes = {
        onConfigAdd: PropTypes.func,
        onConfigRemove: PropTypes.func,
        onConfigMoveUp: PropTypes.func,
        onConfigMoveDown: PropTypes.func,
        onConfigValueChange: PropTypes.func,
        onConditionAdd: PropTypes.func,
        onConditionRemove: PropTypes.func,
        onConditionValueChange: PropTypes.func,
        onConditionMatchChange: PropTypes.func,
        renderItems: PropTypes.func,
        item: PropTypes.object,
        itemsCount: PropTypes.number,
        index: PropTypes.number,
        postsSame: PropTypes.array,
        postsTypesKeys: PropTypes.object,
        errors: PropTypes.object,
        optionsPostsKeys: PropTypes.object,
        optionsPostsTypes: PropTypes.array,
        optionsPostsIds: PropTypes.array,
        optionsConditions: PropTypes.array,
        optionsConditionsOptions: PropTypes.object,
    };

    static defaultProps = {
        onConfigAdd: noop,
        onConfigRemove: noop,
        onConfigMoveUp: noop,
        onConfigMoveDown: noop,
        onConfigValueChange: noop,
        onConditionAdd: noop,
        onConditionRemove: noop,
        onConditionValueChange: noop,
        onConditionMatchChange: noop,
        renderItems: noop,
        item: {},
        itemsCount: 0,
        index: 0,
        postsSame: null,
        postsTypesKeys: null,
        errors: null,
        optionsPostsKeys: null,
        optionsPostsTypes: null,
        optionsPostsIds: null,
        optionsConditions: null,
        optionsConditionsOptions: null,
    };

    state = {
        opened: this.props.item.isNew,
    };

    getField(key, defaultValue = '') {
        return get(this.props.item, key, defaultValue);
    }

    getInputIndex(path) {
        return filter([String(get(this.props.item, 'id')), path]).join('.') || '';
    }

    getErrorIndex(path) {
        return filter([`items.${this.getInputIndex()}`, path]).join('.') || '';
    }

    handleConfigAdd() {
        this.props.onConfigAdd(this.props.item, this.props.index);
    }

    handleConfigRemove() {
        this.props.onConfigRemove(this.props.item, this.props.index);
    }

    handleConfigMoveUp() {
        this.props.onConfigMoveUp(this.props.item, this.props.index);
    }

    handleConfigMoveDown() {
        this.props.onConfigMoveDown(this.props.item, this.props.index);
    }

    handleConfigValueChange(key, value) {
        this.props.onConfigValueChange(this.props.item, key, value);
    }

    handleConditionAdd(conditions) {
        this.props.onConditionAdd(this.props.item, conditions);
    }

    handleConditionRemove(conditionId) {
        this.props.onConditionRemove(this.props.item, conditionId);
    }

    handleConditionValueChange(conditionId, value) {
        this.props.onConditionValueChange(this.props.item, conditionId, value);
    }

    handleConditionMatchChange(conditionId, value) {
        this.props.onConditionMatchChange(this.props.item, conditionId, value);
    }

    handleMinifiable() {
        this.setState((oldState) => ({ opened: oldState.opened === false }));
    }

    render() {
        const {
            renderItems,
            item,
            index,
            itemsCount,
            postsSame,
            postsTypesKeys,
            optionsPostsKeys,
            optionsPostsTypes,
            optionsPostsIds,
            optionsConditions,
        } = this.props;

        return (
            <Card
                className={toClassName([
                    (item.isError === true && 'border-danger') || (item.isWarning === true && 'border-warning'),
                ])}
            >
                <Card.Header
                    className={toClassName([
                        'flex flex-middle padding-none',
                        this.state.opened === false && '--no-border',
                        (item.isUnique === false || item.isEmpty === true) && 'bg-warning-extra',
                    ])}
                >
                    <span
                        className={toClassName(['flex-grow block padding-16', 'pointer'])}
                        onClick={::this.handleMinifiable /* onClick */}
                    >
                        {item.isUnique === false
                            ? Lang.get('post_type.items.fields.not_valid_uniq', item.fieldKey)
                            : item.isEmpty === true
                            ? Lang.get('post_type.items.fields.not_valid_empty')
                            : item.fieldKey}
                    </span>
                    <div className="flex flex-middle padding-16">
                        {index !== 0 && (
                            <SVGArrowUp className="pointer" color={Styles.get('gray')} onClick={::this.handleConfigMoveUp} />
                        )}

                        {index + 1 < itemsCount && (
                            <SVGArrowDown className="pointer" color={Styles.get('gray')} onClick={::this.handleConfigMoveDown} />
                        )}

                        <SVGAdd className="pointer" color={Styles.get('gray')} onClick={::this.handleConfigAdd} />
                        <SVGTrash className="pointer" color={Styles.get('danger')} onClick={::this.handleConfigRemove} />
                    </div>
                </Card.Header>
                {this.state.opened === true && (
                    <Card.Body className={toClassName([this.state.opened === false && 'none'])}>
                        {this.renderInput('id', {
                            type: 'hidden',
                            value: item.id,
                            className: 'none',
                        })}

                        {this.renderInput('position', {
                            type: 'hidden',
                            value: String(index),
                            className: 'none',
                        })}

                        {item.isValue === true &&
                            this.renderInput('type', {
                                type: 'hidden',
                                value: 'empty',
                                className: 'none',
                            })}

                        <ColumnsSingle>
                            <ColumnsDouble>
                                <ColumnsSingleSmall>
                                    {this.renderInput('key', {
                                        type: 'text',
                                        initialValue: item.fieldKey,
                                    })}

                                    {item.isValue === false &&
                                        this.renderInput('label', {
                                            type: item.fieldType === 'empty' ? 'textarea' : 'text',
                                            initialValue: this.getField('label'),
                                        })}

                                    {item.isValue === false &&
                                        this.renderInput('type', {
                                            type: 'select',
                                            input: { options: optionsTypes },
                                            initialValue: item.fieldType,
                                            refreshOnChange: true,
                                        })}

                                    {item.canDataType === true &&
                                        this.renderInput('config.type', {
                                            type: 'select',
                                            input: { options: optionsDataTypes },
                                            initialValue: this.getField('config.type'),
                                            refreshOnChange: true,
                                        })}

                                    {item.canDataCount === true &&
                                        this.getField('config.min', 0) == 0 &&
                                        this.getField('config.max', 0) == 0 &&
                                        this.renderInput('config.count', {
                                            type: 'number',
                                            input: { min: 0, step: 1 },
                                            initialValue: this.getField('config.count'),
                                        })}

                                    {item.canDataMin === true &&
                                        this.getField('config.count', 0) == 0 &&
                                        this.renderInput(
                                            'config.min',
                                            (item.isDate === true && {
                                                type: item.fieldType,
                                                initialValue: this.getField('config.min'),
                                            }) || {
                                                type: 'number',
                                                input: { min: 0, step: 1 },
                                                initialValue: this.getField('config.min'),
                                            },
                                        )}

                                    {item.canDataMax === true &&
                                        this.getField('config.count', 0) == 0 &&
                                        this.renderInput(
                                            'config.max',
                                            (item.isDate === true && {
                                                type: item.fieldType,
                                                initialValue: this.getField('config.max'),
                                            }) || {
                                                type: 'number',
                                                input: { min: 0, step: 1 },
                                                initialValue: this.getField('config.max'),
                                            },
                                        )}

                                    {item.canDataStep === true &&
                                        this.renderInput('config.step', {
                                            type: 'number',
                                            input: { min: 0, step: 'any' },
                                            initialValue: this.getField('config.step'),
                                        })}

                                    {item.canDataWysiwyg === true &&
                                        this.renderInput('config.wysiwyg', {
                                            type: 'selectMultiple',
                                            input: { options: optionsWysiwyg },
                                            initialValue: this.getField('config.wysiwyg'),
                                        })}

                                    {item.canDataAccept === true &&
                                        this.renderInput('config.accept', {
                                            type: 'text',
                                            initialValue: this.getField('config.accept'),
                                        })}

                                    {item.canDataType === true &&
                                        this.renderInput('config.posts.type', {
                                            type: 'select',
                                            input: { options: optionsPostsTypes },
                                            initialValue: this.getField('config.posts.type'),
                                            refreshOnChange: true,
                                        })}

                                    {item.canDataType === true &&
                                        this.renderInput('config.posts.id', {
                                            type: 'select',
                                            input: { empty: true, options: optionsPostsIds },
                                            initialValue: this.getField('config.posts.id'),
                                            refreshOnChange: true,
                                        })}

                                    {item.canDataType === true &&
                                        this.getField('config.posts.id', '') !== '' &&
                                        this.renderInput('config.posts.key', {
                                            type: 'select',
                                            input: {
                                                empty: true,
                                                options: optionsPostsKeys?.[this.getField('config.posts.type')] ?? [],
                                            },
                                            initialValue: this.getField('config.posts.key'),
                                            refreshOnChange: true,
                                        })}

                                    {item.canDataType === true &&
                                        this.getField('config.posts.id', '') !== '' &&
                                        (postsTypesKeys?.[this.getField('config.posts.key')] ?? {}).type === 'rows' &&
                                        this.renderInput('config.posts.label', {
                                            type: 'select',
                                            input: {
                                                empty: true,
                                                options: map(
                                                    postsTypesKeys[this.getField('config.posts.key')].items,
                                                    ({ key: label }) => ({ label, value: label }),
                                                ),
                                            },
                                            initialValue: this.getField('config.posts.label'),
                                        })}
                                </ColumnsSingleSmall>
                                <ColumnsSingleSmall>
                                    {item.canDataMode === true &&
                                        this.renderInput('mode', {
                                            type: 'select',
                                            input: { options: optionsModes },
                                            initialValue: Number(this.getField('mode')),
                                        })}

                                    {item.canDataRest === true &&
                                        this.renderInput('is_required', {
                                            type: 'select',
                                            input: { options: optionsBool },
                                            initialValue: Number(this.getField('is_required')),
                                        })}

                                    {item.canDataRest === true &&
                                        this.renderInput('is_translatable', {
                                            type: 'select',
                                            input: { options: optionsBool },
                                            initialValue: Number(this.getField('is_translatable')),
                                        })}

                                    {item.canDataCast === true &&
                                        this.renderInput('config.cast', {
                                            type: 'select',
                                            input: { empty: true, options: optionsCastTypes },
                                            initialValue: this.getField('config.cast'),
                                        })}

                                    {item.isValue === true &&
                                        this.renderInput('config.value', {
                                            type: 'text',
                                            initialValue: this.getField('config.value'),
                                        })}

                                    {item.isValue === false &&
                                        this.renderInput('restrictions', {
                                            type: 'selectMultiple',
                                            input: { options: postsSame },
                                            initialValue: this.getField('restrictions'),
                                        })}

                                    {item.canDataCondition === true && (
                                        <CardConditions
                                            inputIndex={item.inputIndex}
                                            conditions={item.fieldConditions}
                                            options={optionsConditions}
                                            optionsLeft={filter(
                                                optionsConditions,
                                                (condition) => item.fieldConditionsKeys.indexOf(condition.value) === -1,
                                            )}
                                            optionsOptions={this.props.optionsConditionsOptions}
                                            onAdd={::this.handleConditionAdd}
                                            onRemove={::this.handleConditionRemove}
                                            onValueChange={::this.handleConditionValueChange}
                                            onMatchChange={::this.handleConditionMatchChange}
                                            renderInput={::this.renderInput}
                                        />
                                    )}
                                </ColumnsSingleSmall>
                            </ColumnsDouble>

                            {item.canDataItems === true && renderItems({ items: item.items, item })}
                        </ColumnsSingle>
                    </Card.Body>
                )}
            </Card>
        );
    }

    renderInput(key, props) {
        const name = this.getInputIndex(key);

        return (
            <Input
                {...props}
                key={`input-${name}`}
                id={key}
                name={name}
                error={get(this.props.errors, key, null)}
                onChange={props.onChange ?? ::this.handleConfigValueChange}
            />
        );
    }
}

const typesKeys = [
    'checkbox',
    'date',
    'datetime',
    'email',
    'empty',
    'encrypted',
    'file',
    'group',
    'number',
    'post',
    'radio',
    'rows',
    'select',
    'selectmultiple',
    'text',
    'textarea',
    'time',
    'url',
    'wysiwyg',
];

const castTypesKeys = ['boolean', 'integer', 'string'];

const wysiwygButtonsKeys = [
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'subscript',
    'superscript',
    'paragraphFormat',
    'quote',
    'formatOL',
    'formatUL',
    'insertImage',
    'insertFile',
    'insertLink',
    'insertHR',
    'insertTable',
    'selectAll',
    'clearFormatting',
    'undo',
    'redo',
    'html',
];

const optionsBool = [
    { label: Lang.get('words.no'), value: 0 },
    { label: Lang.get('words.yes'), value: 1 },
];

const optionsModes = [
    { label: Lang.get('post_type.fields.hidden'), value: 0 },
    // { label: Lang.get('post_type.fields.read'), value: 1 },
    { label: Lang.get('post_type.fields.update'), value: 2 },
    // { label: Lang.get('post_type.fields.write'), value: 3 },
];

const optionsDataTypes = [
    { label: 'checkbox', value: 'checkbox' },
    { label: 'radio', value: 'radio' },
    { label: 'select', value: 'select' },
    { label: 'selectmultiple', value: 'selectmultiple' },
];

const optionsTypes = map(typesKeys, (type) => ({ label: type, value: type }));
const optionsWysiwyg = map(wysiwygButtonsKeys, (type) => ({ label: type, value: type }));
const optionsCastTypes = map(castTypesKeys, (type) => ({ label: type, value: type }));

export default ItemConfigPostTypePage;
