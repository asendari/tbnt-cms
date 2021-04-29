'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import noop from 'lodash/noop';
import size from 'lodash/size';

import Card from '../../../../components/custom/Card';
import ColumnsSingleSmall from '../../../../components/custom/ColumnsSingleSmall';

import SVGAdd from '../../../../components/svg/add';

import CardCondition from './CardCondition';

import Lang from '../../../../helpers/lang';
import Styles from '../../../../helpers/styles';

class CardConditionsConfigPostTypePage extends React.PureComponent {
    static propTypes = {
        onAdd: PropTypes.func,
        onRemove: PropTypes.func,
        onValueChange: PropTypes.func,
        onMatchChange: PropTypes.func,
        renderInput: PropTypes.func,
        inputIndex: PropTypes.string,
        conditions: PropTypes.object,
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
        inputIndex: null,
        conditions: null,
        options: null,
        optionsLeft: null,
        optionsOptions: null,
    };

    handleConditionAdd() {
        this.props.onAdd(this.props.optionsLeft);
    }

    render() {
        const { conditions } = this.props;

        return (
            <Card>
                <Card.Header>{Lang.get('post_type.cards.conditions')}</Card.Header>
                <Card.Body>
                    <ColumnsSingleSmall>
                        {(size(conditions) === 0 && (
                            <Card>
                                <Card.Header className="flex flex-between flex-middle">
                                    <span>{Lang.get('post_type.items.fields.condition')}</span>
                                    <div className="flex flex-middle">
                                        <SVGAdd
                                            className="pointer"
                                            color={Styles.get('gray')}
                                            onClick={::this.handleConditionAdd}
                                        />
                                    </div>
                                </Card.Header>
                            </Card>
                        )) ||
                            map(conditions, ::this.renderCondition)}
                    </ColumnsSingleSmall>
                </Card.Body>
            </Card>
        );
    }

    renderCondition(valuesIds, id) {
        return (
            <CardCondition
                key={`condition-${this.props.inputIndex}-${id}`}
                id={id}
                valuesIds={valuesIds}
                options={this.props.options}
                optionsLeft={this.props.optionsLeft}
                optionsOptions={this.props.optionsOptions}
                onAdd={::this.props.onAdd}
                onRemove={::this.props.onRemove}
                onValueChange={::this.props.onValueChange}
                onMatchChange={::this.props.onMatchChange}
                renderInput={::this.props.renderInput}
            />
        );
    }
}

export default CardConditionsConfigPostTypePage;
