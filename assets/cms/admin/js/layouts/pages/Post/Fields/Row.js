'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import filter from 'lodash/filter';
import map from 'lodash/map';
import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import Card from '../../../../components/custom/Card';
import ColumnsSingleSmall from '../../../../components/custom/ColumnsSingleSmall';

import SVGAdd from '../../../../components/svg/add';
import SVGArrowUp from '../../../../components/svg/arrow-up';
import SVGArrowDown from '../../../../components/svg/arrow-down';
import SVGTrash from '../../../../components/svg/trash';

import Styles from '../../../../helpers/styles';

class RowFieldsPostPage extends React.PureComponent {
    static propTypes = {
        onFieldRowAdd: PropTypes.func,
        onFieldRowRemove: PropTypes.func,
        onFieldRowMoveUp: PropTypes.func,
        onFieldRowMoveDown: PropTypes.func,
        renderItem: PropTypes.func,
        config: PropTypes.object,
        row: PropTypes.object,
        index: PropTypes.number,
        total: PropTypes.number,
        canAddRow: PropTypes.bool,
        canDeleteRow: PropTypes.bool,
    };

    static defaultProps = {
        onFieldRowAdd: noop,
        onFieldRowRemove: noop,
        onFieldRowMoveUp: noop,
        onFieldRowMoveDown: noop,
        renderItem: noop,
        config: {},
        row: {},
        index: 0,
        total: 0,
        canAddRow: false,
        canDeleteRow: false,
    };

    handleFieldRowAdd() {
        this.props.onFieldRowAdd(this.props.config, this.props.index);
    }

    handleFieldRowRemove() {
        this.props.onFieldRowRemove(this.props.config, this.props.index);
    }

    handleFieldRowMoveUp() {
        this.props.onFieldRowMoveUp(this.props.config, this.props.index);
    }

    handleFieldRowMoveDown() {
        this.props.onFieldRowMoveDown(this.props.config, this.props.index);
    }

    render() {
        const { renderItem, config, row, index, total, canAddRow, canDeleteRow } = this.props;

        return (
            <Card className={toClassName([config.mode === 0 && 'superadmin'])}>
                <Card.Header className="flex flex-between flex-middle">
                    <span title={config.key}>{filter([config.label, total === 0 ? '' : `${index + 1}/${total}`]).join(' ')}</span>
                    <div className="flex flex-middle">
                        {index !== 0 && (
                            <SVGArrowUp
                                className="pointer"
                                style={{ width: 24 }}
                                color={Styles.get('gray')}
                                onClick={::this.handleFieldRowMoveUp}
                            />
                        )}

                        {index + 1 < total && (
                            <SVGArrowDown
                                className="pointer"
                                style={{ width: 24 }}
                                color={Styles.get('gray')}
                                onClick={::this.handleFieldRowMoveDown}
                            />
                        )}

                        {canAddRow === true && (
                            <SVGAdd
                                className="pointer"
                                style={{ width: 24 }}
                                color={Styles.get('gray')}
                                onClick={::this.handleFieldRowAdd}
                            />
                        )}

                        {canDeleteRow === true && (
                            <SVGTrash
                                className="pointer"
                                style={{ width: 24 }}
                                color={Styles.get('danger')}
                                onClick={::this.handleFieldRowRemove}
                            />
                        )}
                    </div>
                </Card.Header>
                <Card.Body>
                    <ColumnsSingleSmall>{map(row.items, renderItem)}</ColumnsSingleSmall>
                </Card.Body>
            </Card>
        );
    }
}

export default RowFieldsPostPage;
