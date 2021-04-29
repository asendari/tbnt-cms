'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import PropTypeForm from 'lib/js/components/types/Form';

import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import noop from 'lodash/noop';
import trim from 'lodash/trim';

import purifyHtml from 'lib/js/utils/purifyHtml';
import toArray from 'lib/js/utils/toArray';
import toBool from 'lib/js/utils/toBool';

import Input from '../../../../components/base/Input';
import Text from '../../../../components/base/Text';

import LangConfig from '../../../../config/lang';

const defaultLangCode = LangConfig.get('default_code');

class FieldFieldsPostPage extends React.Component {
    static propTypes = {
        onFieldChange: PropTypes.func,
        form: PropTypeForm.isRequired,
        config: PropTypes.object,
        postsOptions: PropTypes.array,
        conditions: PropTypes.object,
        errors: PropTypes.array,
        langCode: PropTypes.string,
    };

    static defaultProps = {
        onFieldChange: noop,
        config: {},
        postsOptions: [],
        conditions: {},
        errors: null,
        langCode: null,
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            (this.props.config.is_translatable === true && isEqual(this.props.langCode, nextProps.langCode) === false) ||
            isEqual(this.props.errors, nextProps.errors) === false ||
            isEqual(this.props.postsOptions, nextProps.postsOptions) === false ||
            isEqual(this.props.config, nextProps.config) === false
        );
    }

    isConfigType(types) {
        return toArray(types).indexOf(this.props.config.type) !== -1;
    }

    isValueType(types) {
        return toArray(types).indexOf(this.getFieldType()) !== -1;
    }

    getValue(langCode, options, inputInnerProps) {
        const { config } = this.props;

        const origValue = get(config.value, config.is_translatable === true ? `trans.${langCode}` : 'value');

        let formattedValue = filter(toArray(origValue));

        if (this.isValueType(['checkbox', 'selectmultiple']) === false) formattedValue = head(formattedValue) ?? null;

        if (
            (config.config?.cast === undefined && this.isValueType('number') === true) ||
            config.config?.cast === 'boolean' ||
            config.config?.cast === 'integer'
        ) {
            if (this.isValueType(['checkbox', 'selectmultiple']) === false) formattedValue = Number(formattedValue || 0) || 0;
            else formattedValue = map(formattedValue, (iV) => Number(iV || 0) || 0);
        }

        if (
            !formattedValue &&
            this.isValueType(['checkbox', 'radio', 'select', 'selectmultiple']) === true &&
            inputInnerProps.empty === false
        )
            formattedValue = head(options)?.value ?? null;

        formattedValue =
            this.isValueType(['checkbox', 'selectmultiple']) === true
                ? map(formattedValue, String)
                : this.isValueType('file') === true
                ? get(origValue, 'fileurl', null)
                : String(formattedValue ?? '');

        return formattedValue;
    }

    getFieldType() {
        return (this.isConfigType('post') === true ? this.props.config.config?.type : this.props.config.type) ?? null;
    }

    getFieldIndex() {
        return String(get(this.props.config.value, 'id')) || null;
    }

    getErrorIndex() {
        return `fields.${this.getFieldIndex()}`;
    }

    handleChange(value) {
        this.props.onFieldChange(this.props.config, value);
    }

    render() {
        const { form, config, postsOptions, conditions, errors, langCode } = this.props;

        const fieldIndex = this.getFieldIndex();
        const inputType = postTypeInput[this.getFieldType()];

        if (fieldIndex === null || inputType === null) return null;

        const options =
            this.isConfigType('post') === true
                ? postsOptions
                : this.isValueType(['checkbox', 'radio', 'select', 'selectmultiple']) === false
                ? null
                : map(config.items ?? [], (it) => ({
                      label: it.label,
                      value: String(it.config?.value ?? it.id),
                  }));

        const inputProps = {
            mandatory: config.is_required,
            superadmin: config.mode === 0,
        };

        const inputInnerProps = {};

        if (config.is_translatable === true) {
            inputProps.langCode = langCode;
            inputProps['data-translatable'] = true;
            inputProps.mandatory = inputProps.mandatory === true && langCode === defaultLangCode;
        }

        if (
            this.isValueType([
                /* 'checkbox', */ 'date',
                'datetime',
                'encrypted',
                'number',
                'rows',
                /* 'selectmultiple', */ 'text',
                'textarea',
                'time',
                'wysiwyg',
            ]) === true
        ) {
            inputInnerProps.min = config.config?.min ?? null;
        }

        if (
            this.isValueType([
                /* 'checkbox', */ 'date',
                'datetime',
                'encrypted',
                'file',
                'number',
                'rows',
                /* 'selectmultiple', */ 'time',
            ]) === true
        ) {
            inputInnerProps.max = config.config?.max ?? null;
        }

        if (this.isValueType(['text', 'textarea', 'wysiwyg']) === true) {
            inputInnerProps.maxLength = config.config?.max ?? null;
        }

        if (this.isValueType('number') === true) {
            inputInnerProps.step = config.config?.step ?? null;
        }

        if (this.isValueType('select') === true) {
            inputInnerProps.empty =
                this.isConfigType('post') === true ||
                (conditions.values.indexOf(config.id) !== -1 && filter(map(options, 'value'), toBool).length === 0);
        }

        if (this.isValueType('file') === true) {
            inputInnerProps.accept = String(config.config?.accept ?? 'jpg,png,svg')
                .split(',')
                .map((m) => `.${trim(m, '.')}`)
                .join(',');
            inputInnerProps.remove = inputProps.mandatory === false;
        }

        if (this.isValueType('wysiwyg') === true) {
            inputInnerProps.toolbarButtons = toArray(config.config?.wysiwyg ?? defaultDataWysiwyg);
        }

        return (
            <div title={config.key}>
                {(inputType === 'empty' && <Text>{config.label}</Text>) || (
                    <Input
                        {...inputProps}
                        type={inputType}
                        name={fieldIndex}
                        label={config.label}
                        input={{
                            ...inputInnerProps,
                            options,
                            placeholder:
                                (langCode === defaultLangCode
                                    ? null
                                    : this.getValue(defaultLangCode, options, inputInnerProps)) || undefined,
                        }}
                        initialValue={this.getValue(langCode, options, inputInnerProps)}
                        formHelper={form}
                        error={errors}
                        renderError={::this.renderError}
                        onChange={::this.handleChange}
                    />
                )}
            </div>
        );
    }

    renderError({ error }) {
        return <span>{toArray(error).join('\n').replace(this.getErrorIndex(), this.props.config.label.toLowerCase())}</span>;
    }
}

const postTypeInput = {
    checkbox: 'checkboxList',
    date: 'date',
    datetime: 'datetime',
    email: 'email',
    empty: 'empty',
    encrypted: 'password',
    file: 'upload',
    number: 'number',
    radio: 'radioList',
    select: 'select',
    selectmultiple: 'selectMultiple',
    text: 'text',
    textarea: 'textarea',
    time: 'time',
    url: 'url',
    wysiwyg: 'wysiwyg',
};

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

export default FieldFieldsPostPage;
