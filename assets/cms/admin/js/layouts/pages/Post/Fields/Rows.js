'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import Card from '../../../../components/custom/Card';
import ColumnsSingleSmall from '../../../../components/custom/ColumnsSingleSmall';

import SVGAdd from '../../../../components/svg/add';

import Row from './Row';

import Styles from '../../../../helpers/styles';

class RowsFieldsPostPage extends React.PureComponent {
    static propTypes = {
        onFieldRowAdd: PropTypes.func,
        config: PropTypes.object,
    };

    static defaultProps = {
        onFieldRowAdd: noop,
        config: {},
    };

    handleFieldRowAdd() {
        this.props.onFieldRowAdd(this.props.config, 0);
    }

    render() {
        const { config, ...rest } = this.props;

        const total = config.rows.length || 0;

        const fixedRows = Number(config.config?.count) || null;
        const maxRows = (fixedRows ?? Number(config.config?.max)) || null;
        const minRows = fixedRows ?? Math.max(0, Number(config.config?.min) || 0);

        const canAddRow = maxRows === null || total < maxRows;
        const canDeleteRow = minRows === null || total > minRows;

        return (
            <ColumnsSingleSmall>
                {(total === 0 && (
                    <Card className={toClassName([config.mode === 0 && 'superadmin'])}>
                        <Card.Header className="flex flex-between flex-middle">
                            <span title={config.key}>{config.label}</span>
                            <div className="flex flex-middle">
                                <SVGAdd
                                    className="pointer"
                                    style={{ width: 24 }}
                                    color={Styles.get('gray')}
                                    onClick={::this.handleFieldRowAdd}
                                />
                            </div>
                        </Card.Header>
                    </Card>
                )) ||
                    map(config.rows, (row, index) => (
                        <Row
                            key={`rows-row-${row.id}`}
                            {...rest}
                            config={config}
                            row={row}
                            index={index}
                            total={total}
                            canAddRow={canAddRow}
                            canDeleteRow={canDeleteRow}
                        />
                    ))}
            </ColumnsSingleSmall>
        );
    }
}

export default RowsFieldsPostPage;
