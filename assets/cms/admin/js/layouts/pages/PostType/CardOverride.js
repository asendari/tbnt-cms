'use strict';

import React from 'react';
import PropTypes from 'lib/js/helpers/types';
import { orderBy } from 'natural-orderby';

import head from 'lodash/head';
import noop from 'lodash/noop';

import toArray from 'lib/js/utils/toArray';

import Card from '../../../components/custom/Card';
import ColumnsSingleSmall from '../../../components/custom/ColumnsSingleSmall';

import Input from '../../../components/base/Input';

import SVGAdd from '../../../components/svg/add';
import SVGTrash from '../../../components/svg/trash';

import Lang from '../../../helpers/lang';
import Styles from '../../../helpers/styles';

class CardOverridePostTypePage extends React.Component {
    static propTypes = {
        onAdd: PropTypes.func,
        onRemove: PropTypes.func,
        onKeyChange: PropTypes.func,
        onValueChange: PropTypes.func,
        id: PropTypes.string,
        value: PropTypes.any,
        options: PropTypes.array,
        pages: PropTypes.array,
        fields: PropTypes.object,
        errors: PropTypes.object,
        form: PropTypes.Form,
    };

    static defaultProps = {
        onAdd: noop,
        onRemove: noop,
        onKeyChange: noop,
        onValueChange: noop,
        id: null,
        value: null,
        options: null,
        pages: null,
        fields: null,
        errors: null,
        form: null,
    };

    state = {
        fieldType: getFieldType(this.props),
        inputProps: getInputProps(getFieldType(this.props), this.props),
    };

    static getDerivedStateFromProps(props, state) {
        const fieldType = getFieldType(props);

        return { fieldType, inputProps: getInputProps(fieldType, props) };
    }

    handleAdd() {
        this.props.onAdd();
    }

    handleRemove(key) {
        this.props.onRemove(key);
    }

    handleKeyChange(newKey, oldKey) {
        this.props.onKeyChange(newKey, oldKey);
    }

    handleValueChange(value, key) {
        this.props.onValueChange(value, key);
    }

    render() {
        const { id, options, errors, form } = this.props;

        return (
            <Card>
                <Card.Header className="flex flex-between flex-middle">
                    <span>{Lang.get('post_type.fields.override')}</span>
                    <div className="flex flex-middle">
                        {options?.length > 0 && (
                            <SVGAdd className="pointer" color={Styles.get('gray')} onClick={::this.handleAdd} />
                        )}

                        <SVGTrashCardOverridePostTypePage id={id} onClick={::this.handleRemove} />
                    </div>
                </Card.Header>
                <Card.Body>
                    <ColumnsSingleSmall>
                        <InputKeyCardOverridePostTypePage
                            id={id}
                            optionsItems={orderBy(options?.concat([{ label: id, value: id }]), 'label')}
                            onChange={::this.handleKeyChange}
                        />
                        <InputValueCardOverridePostTypePage
                            id={id}
                            type={this.state.fieldType}
                            error={errors?.[`config.override.${id}`] ?? ''}
                            formHelper={form}
                            onChange={::this.handleValueChange}
                            {...this.state.inputProps}
                        />
                    </ColumnsSingleSmall>
                </Card.Body>
            </Card>
        );
    }
}

const SVGTrashCardOverridePostTypePage = React.memo(({ onClick, id, ...rest }) => {
    const handleClick = () => {
        onClick(id);
    };

    return <SVGTrash {...rest} className="pointer" color={Styles.get('danger')} onClick={handleClick} />;
});

const InputKeyCardOverridePostTypePage = React.memo(({ onChange, id, optionsItems, ...rest }) => {
    const handleChange = (value) => {
        onChange(value, id);
    };

    return (
        <Input
            {...rest}
            type="select"
            label={Lang.get('post_type.fields.override_key')}
            input={{ options: optionsItems }}
            initialValue={id ?? head(optionsItems)}
            onChange={handleChange}
        />
    );
});

const InputValueCardOverridePostTypePage = React.memo(({ onChange, id, ...rest }) => {
    const handleChange = (value) => {
        onChange(value, id);
    };

    const _renderError = ({ error }) => (
        <span>
            {toArray(error)
                .join('\n')
                .replace(`config.override.${id}`, Lang.get('post_type.fields.override_value').toLowerCase())}
        </span>
    );

    return (
        <Input
            {...rest}
            name={`config.override.${id}`}
            label={Lang.get('post_type.fields.override_value')}
            renderError={_renderError}
            onChange={handleChange}
        />
    );
});

const getFieldType = (props) => props.fields?.[props.id];

const getInputProps = (fieldType, props) => {
    const inputProps = {};

    if (fieldType === 'posts') {
        inputProps.type = 'select';
        inputProps.input = { options: props.pages };
    }

    inputProps.initialValue = props.value ?? (fieldType === 'posts' ? head(props.pages) : null);

    return inputProps;
};

export default CardOverridePostTypePage;
