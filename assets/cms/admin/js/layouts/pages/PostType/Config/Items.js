'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import noop from 'lodash/noop';

import Card from '../../../../components/custom/Card';
import ColumnsSingle from '../../../../components/custom/ColumnsSingle';

import SVGAdd from '../../../../components/svg/add';

import Item from './Item';

import Lang from '../../../../helpers/lang';
import Styles from '../../../../helpers/styles';

class ItemsConfigPostTypePage extends React.PureComponent {
    static propTypes = {
        onConfigAdd: PropTypes.func,
        renderItem: PropTypes.func,
        item: PropTypes.object,
        items: PropTypes.array,
    };

    static defaultProps = {
        onConfigAdd: noop,
        renderItem: noop,
        item: null,
        items: null,
    };

    state = {
        itemsLength: getLength(this.props),
    };

    static getDerivedStateFromProps(props, state) {
        return { itemsLength: getLength(props) };
    }

    handleConfigAdd() {
        this.props.onConfigAdd(this.props.item, this.state.itemsLength, false);
    }

    render() {
        return (
            <ColumnsSingle>
                {map(this.props.items, ::this.renderItem)}

                <Card>
                    <Card.Header className="flex flex-between flex-middle --no-border">
                        <span>{Lang.get('post_type.items.fields.new', 0)}</span>
                        <div className="flex flex-middle">
                            <SVGAdd className="pointer" color={Styles.get('gray')} onClick={::this.handleConfigAdd} />
                        </div>
                    </Card.Header>
                </Card>
            </ColumnsSingle>
        );
    }

    renderItem(item, index) {
        return this.props.renderItem({ item, itemsCount: this.state.itemsLength, index });
    }
}

const getLength = (props) => props.items?.length;

export default ItemsConfigPostTypePage;
