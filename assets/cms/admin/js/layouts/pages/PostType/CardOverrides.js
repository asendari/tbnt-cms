'use strict';

import React from 'react';
import PropTypes from 'lib/js/helpers/types';

import difference from 'lodash/difference';
import keys from 'lodash/keys';
import map from 'lodash/map';
import noop from 'lodash/noop';
import size from 'lodash/size';

import Card from '../../../components/custom/Card';
import ColumnsSingleSmall from '../../../components/custom/ColumnsSingleSmall';

import SVGAdd from '../../../components/svg/add';

import CardOverride from './CardOverride';

import Lang from '../../../helpers/lang';
import Styles from '../../../helpers/styles';

class CardOverridesConfigPostTypePage extends React.PureComponent {
    static propTypes = {
        onAdd: PropTypes.func,
        onRemove: PropTypes.func,
        onKeyChange: PropTypes.func,
        onValueChange: PropTypes.func,
        overrides: PropTypes.object,
        allFields: PropTypes.object,
        allFieldsKeys: PropTypes.array,
        loader: PropTypes.bool,
        pages: PropTypes.array,
        errors: PropTypes.object,
        form: PropTypes.Form,
    };

    static defaultProps = {
        onAdd: noop,
        onRemove: noop,
        onKeyChange: noop,
        onValueChange: noop,
        overrides: null,
        allFields: null,
        allFieldsKeys: null,
        loader: false,
        pages: null,
        errors: null,
        form: null,
    };

    state = {
        options: getOptions(this.props),
    };

    static getDerivedStateFromProps(props, state) {
        return { options: getOptions(props) };
    }

    handleConditionAdd() {
        this.props.onConditionAdd(this.props.optionsConditionsLeft);
    }

    render() {
        const { loader, overrides } = this.props;

        return (
            <Card>
                <Card.Header>{Lang.get('post_type.cards.overrides')}</Card.Header>
                <Card.Body loader={loader}>
                    <ColumnsSingleSmall>
                        {(size(overrides) === 0 && (
                            <Card>
                                <Card.Header className="flex flex-between flex-middle">
                                    <span>{Lang.get('post_type.fields.override')}</span>
                                    <div className="flex flex-middle">
                                        <SVGAdd className="pointer" color={Styles.get('gray')} onClick={::this.props.onAdd} />
                                    </div>
                                </Card.Header>
                            </Card>
                        )) ||
                            map(overrides, ::this.renderOverride)}
                    </ColumnsSingleSmall>
                </Card.Body>
            </Card>
        );
    }

    renderOverride(value, key) {
        return (
            <CardOverride
                key={`override-${key}`}
                id={key}
                value={value}
                options={this.state.options}
                pages={this.props.pages}
                fields={this.props.allFields}
                errors={this.props.errors}
                form={this.props.form}
                onAdd={::this.props.onAdd}
                onRemove={::this.props.onRemove}
                onKeyChange={::this.props.onKeyChange}
                onValueChange={::this.props.onValueChange}
            />
        );
    }
}

const getOptions = (props) => map(difference(props.allFieldsKeys, keys(props.overrides)), (value) => ({ label: value, value }));

export default CardOverridesConfigPostTypePage;
