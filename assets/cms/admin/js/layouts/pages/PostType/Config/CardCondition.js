'use strict';

import React from 'react';
import PropTypes from 'lib/js/helpers/types';
import { orderBy } from 'natural-orderby';

import filter from 'lodash/filter';
import find from 'lodash/find';
import noop from 'lodash/noop';

import Card from '../../../../components/custom/Card';
import ColumnsSingleSmall from '../../../../components/custom/ColumnsSingleSmall';

import SVGAdd from '../../../../components/svg/add';
import SVGTrash from '../../../../components/svg/trash';

import Lang from '../../../../helpers/lang';
import Styles from '../../../../helpers/styles';

class CardConditionConfigPostTypePage extends React.PureComponent {
    static propTypes = {
        onAdd: PropTypes.func,
        onRemove: PropTypes.func,
        onValueChange: PropTypes.func,
        onMatchChange: PropTypes.func,
        renderInput: PropTypes.func,
        id: PropTypes.NumberString,
        valuesIds: PropTypes.array,
        options: PropTypes.array,
        optionsLeft: PropTypes.array,
        optionsOptions: PropTypes.object,
    };

    static defaultProps = {
        onAdd: noop,
        onRemove: noop,
        onValueChange: noop,
        onMatchChange: noop,
        renderInput: noop,
        id: null,
        valuesIds: null,
        options: null,
        optionsLeft: null,
        optionsOptions: null,
    };

    state = {
        label: getLabel(this.props),
    };

    static getDerivedStateFromProps(props, state) {
        return { label: getLabel(props) };
    }

    handleConditionAdd() {
        this.props.onAdd(this.props.optionsLeft);
    }

    handleConditionRemove() {
        this.props.onRemove(this.props.id);
    }

    handleConditionValueChange(id, value) {
        this.props.onValueChange(this.props.id, value);
    }

    handleConditionMatchChange(id, value) {
        this.props.onMatchChange(this.props.id, value);
    }

    render() {
        const { renderInput, id, valuesIds, optionsLeft, optionsOptions } = this.props;

        return (
            <Card>
                <Card.Header className="flex flex-between flex-middle">
                    <span>{Lang.get('post_type.items.fields.condition')}</span>
                    <div className="flex flex-middle">
                        {optionsLeft?.length > 0 && (
                            <SVGAdd className="pointer" color={Styles.get('gray')} onClick={::this.handleConditionAdd} />
                        )}

                        <SVGTrash className="pointer" color={Styles.get('danger')} onClick={::this.handleConditionRemove} />
                    </div>
                </Card.Header>
                <Card.Body>
                    <ColumnsSingleSmall>
                        {renderInput(`conditions.${id}.value`, {
                            type: 'select',
                            label: Lang.get('post_type.items.fields.condition_value'),
                            input: {
                                options: orderBy(filter(optionsLeft?.concat([{ label: this.state.label, value: id }]), 'label')),
                            },
                            initialValue: id,
                            refreshOnChange: true,
                            onChange: ::this.handleConditionValueChange,
                        })}

                        {renderInput(`conditions.${id}`, {
                            type: 'selectMultiple',
                            label: Lang.get('post_type.items.fields.condition_match'),
                            input: { options: optionsOptions?.[this.state.label] ?? [] },
                            initialValue: valuesIds,
                            refreshOnChange: true,
                            onChange: ::this.handleConditionMatchChange,
                        })}
                    </ColumnsSingleSmall>
                </Card.Body>
            </Card>
        );
    }
}

const getLabel = (props) => find(props.options, (condition) => condition.value == props.id)?.label ?? '';

export default CardConditionConfigPostTypePage;
